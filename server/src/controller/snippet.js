const Snippet = require('../model/snippet.js');
const CoworkerRules = require('../model/coworkersRules.js');
const User = require('../model/user.js');

const authAction = async (req, action) => {
    const owner = req.params.user;
    const usr = req.user.username;
    const snippetID = req.params.snippetID;

    const defaultResponse = {status: 401, msg: `you are not authorized to ${action} this snippet`};

    // if the user is the owner
    if (owner == usr) return {status: 200};

    if (action == 'read') {
        const snippetResponse = await Snippet.getSnippet(usr, snippetID);
        if (snippetResponse[0].length && !snippetResponse[0][0].isPrivate) {
            const {id, user, title, descr, snippet, isPrivate} = snippetResponse[0][0];

            return {
                status: 200,
                msg: {
                    id,
                    user,
                    title,
                    descr,
                    snippet,
                    isPrivate,
                },
            };
        }

        return defaultResponse;
    }

    const rulesResponse = await CoworkerRules.readCoworkerRules(owner, usr);
    // if the use is not a coworker
    if (rulesResponse[0].length) {
        // console.log(rulesResponse[0][0].exceptions[snippetID]);
        if (
            (rulesResponse[0][0].exceptions?.[snippetID] &&
                rulesResponse[0][0].exceptions[snippetID]?.[action]) ||
            rulesResponse[0][0].generic?.[action]
        ) {
            return {status: 200};
        }
    }

    return defaultResponse;
};

const read = async (req, res) => {
    const result = await authAction(req, 'read');
    // if has access authAction will return the snippet props
    // - I should probably separate the concerns,
    //- but I have to figure out how to do this using one db request
    res.status(result.status).json({msg: result.msg});
};

const edit = async (req, res) => {
    const result = await authAction(req, 'update');
    if (result?.status == 401) {
        return res.status(result.status).json({msg: result.msg});
    }

    const owner = req.params.user;
    const response = await Snippet.editSnippet(owner, req.body.props, req.params.snippetID);
    // console.log(response);
    return response[0]?.affectedRows
        ? {status: 200, msg: `snippet has been edited`}
        : {status: 500, msg: `something happend while editting the snippet`};
};

const remove = async (req, res) => {
    const result = await authAction(req, 'delete');
    if (result?.status == 401) {
        return res.status(result.status).json({msg: result.msg});
    }

    const owner = req.params.user;
    const snippetID = req.params.snippetID;
    const response = await Snippet.deleteSnippet(owner, snippetID);
    return response[0]?.affectedRows
        ? {status: 200, msg: `snippet has been deleted`}
        : {status: 500, msg: `something happend while deleting the snippet`};
};

// ____________________________

const readMiddleware = async (req, res, next) => {
    const snippetsOwner = req.params.user; // if  this is not specified, the user is requesting all of the snippets
    const user = req.user.username;

    // console.log(snippetsOwner);
    // console.log(user);

    const snippetsResponse = snippetsOwner
        ? await Snippet.getUserSnippets(snippetsOwner)
        : await Snippet.getAllSnippets();

    // if empty
    if (!snippetsResponse[0].length) {
        return res.json({msg: []});
    }

    req.snippets = snippetsResponse[0];

    // get coworkers rules
    let rulesResponse = {};
    if (snippetsOwner) {
        rulesResponse = await CoworkerRules.readCoworkerRules(snippetsOwner, user);
        // if the use is not a coworker
        if (!rulesResponse[0].length) {
            req.rules = [];
            return next();
        }

        // get owner specific rules
        req.rules = {
            generic: rulesResponse[0][0].generic,
            exceptions: rulesResponse[0][0].exceptions,
        };
    } else {
        rulesResponse = await CoworkerRules.readAllRules({coworker: user});
        // console.log(rulesResponse);

        if (!rulesResponse) {
            return res.status(500).json({msg: 'something happned while getting the data'});
        }

        // get all the rules
        req.rules = rulesResponse[0].reduce((acc, rule) => {
            acc[rule.user] = rule;
            return acc;
        }, {});
    }

    next();
};

const appendSnippet = (req, filteredSnippets, snippetObj, access) => {
    // console.log(access);
    if (access?.read) {
        const {id, user, title, descr, snippet, isPrivate} = snippetObj;
        if (req.query?.meta) {
            return filteredSnippets.push({
                id,
                title,
            });
        }
        filteredSnippets.push({
            id,
            user,
            title,
            descr,
            snippet,
            isPrivate,
            access,
        });
    }
};

const readUserAll = async (req, res) => {
    const genericAccess = req.rules.generic;
    // console.log(req.snippets);
    // filter snippets according to rules
    const filteredSnippets = [];
    req.snippets.forEach((snippetObj) => {
        if (snippetObj.user == req.user.username) {
            appendSnippet(req, filteredSnippets, snippetObj, {
                read: true,
                update: true,
                delete: true,
            });
        } else {
            if (!snippetObj.isPrivate && !Object.keys(req.rules).length) {
                // if no rule, and snippet is public: access is read-only
                appendSnippet(req, filteredSnippets, snippetObj, {read: true});
            } else {
                if (Object.keys(req.rules).length) {
                    // if there is an exception for the snippet, apply the exception rule
                    const exceptionRule = req.rules.exceptions[snippetObj.id];
                    if (req.rules.exceptions?.[snippetObj.id]) {
                        appendSnippet(req, filteredSnippets, snippetObj, exceptionRule);
                    } else {
                        // if there is no exception, then apply the generic acess rule
                        appendSnippet(req, filteredSnippets, snippetObj, req.rules.generic);
                    }
                }
            }
        }
    });
    // console.log(filteredSnippets);

    res.json({msg: {snippets: filteredSnippets, genericAccess}});
};

const readAll = async (req, res) => {
    const user = req.user.username;
    const isUserMod = Boolean((await User.getMod(user))[0].length);

    // filter snippets according to rules
    const filteredSnippets = [];
    req.snippets.forEach((snippetObj) => {
        if (user == snippetObj.user || isUserMod) {
            appendSnippet(req, filteredSnippets, snippetObj, {
                read: true,
                update: true,
                delete: true,
            });
        } else {
            // console.log(req.rules);
            if (!snippetObj.isPrivate && !req.rules?.[snippetObj.user]) {
                // if no rule, and snippet is public: access is read-only
                appendSnippet(req, filteredSnippets, snippetObj, {read: true});
            } else {
                if (req.rules?.[snippetObj.user]) {
                    // if there is an exception for the snippet, apply the exception rule
                    if (req.rules[snippetObj.user].exceptions?.[snippetObj.id]) {
                        const exceptionRule =
                            req.rules[snippetObj.user].exceptions?.[snippetObj.id];
                        appendSnippet(req, filteredSnippets, snippetObj, exceptionRule);
                    } else {
                        // if there is no exception, then apply the generic acess rule
                        const genericRule = req.rules[snippetObj.user].generic;
                        appendSnippet(req, filteredSnippets, snippetObj, genericRule);
                    }
                }
            }
        }
    });

    res.json({msg: {snippets: filteredSnippets}});
};

const create = async (req, res) => {
    // console.log(req.body.props.coworkers);

    if (req.user.username == req.params.user) {
        const response = await Snippet.createSnippet({user: req.user.username, ...req.body.props});
        // console.log(response);
        if (response && response[0]?.affectedRows) {
            return res.json({msg: 'snippet created successfully'});
        }

        return res.status(500).json({
            msg: 'something bad happend',
        });
    }

    // ELSE
    // console.log(req.params.user, req.user.username);
    const rulesResponse = await CoworkerRules.readCoworkerRules(req.params.user, req.user.username);
    // console.log(req.params.user);
    // if the use is not a coworker
    if (rulesResponse[0].length) {
        // check if user has the creation access
        if (rulesResponse[0][0].generic?.create) {
            const response = await Snippet.createSnippet({
                user: req.params.user,
                ...req.body.props,
            });
            // console.log(response);
            if (response && response[0]?.affectedRows) {
                return res.json({msg: 'snippet created successfully'});
            }

            return res.status(500).json({
                msg: 'something bad happend',
            });
        }
    }

    // this should never run
    res.status(401).json({msg: 'guess what? you can not create a snippets on others accounts'});
};

module.exports = {readMiddleware, readAll, readUserAll, read, create, edit, remove};
