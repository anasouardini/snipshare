const Snippet = require('../model/snippet.js');
const CoworkerRules = require('../model/coworkersRules.js');
const User = require('../model/user.js');
const Z = require('zod');

const authAction = async (req, action) => {
    const owner = req.params.user;
    const usr = req.user.username;
    const snippetID = req.params.snippetID;

    const defaultResponse = {
        status: 401,
        msg: `you are not authorized to ${action} this snippet, or there is no such snippet`,
    };

    // if the user is the owner
    if (owner == usr && action != 'read') return {status: 200};

    let rulesResponse = null;

    if (action == 'read') {
        const snippetResponse = await Snippet.getSnippet(usr, snippetID);
        if (!snippetResponse[0].length) return defaultResponse;

        let access = {};

        if (owner == usr) {
            access = {read: true, update: true, delete: true};
        } else {
            rulesResponse = await CoworkerRules.readCoworkerRules(owner, usr);
            if (rulesResponse[0].length) {
                access =
                    rulesResponse[0][0].exceptions?.[snippetID] ??
                    rulesResponse[0][0].generic?.[action];
            } else {
                return defaultResponse;
            }
        }

        const {id, user, title, descr, snippet, isPrivate, author} = snippetResponse[0][0];
        return {
            status: 200,
            msg: {
                id,
                user,
                title,
                descr,
                snippet,
                isPrivate,
                author,
                access,
            },
        };
    }

    if (rulesResponse == null) {
        rulesResponse = await CoworkerRules.readCoworkerRules(owner, usr);
    }
    // if the user is a coworker
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
    // console.log(result);
    res.status(result.status).json({msg: result.msg});
};

const edit = async (req, res) => {
    // input validation
    const schema = Z.object({
        title: Z.string(),
        descr: Z.string(),
        snippet: Z.string(),
        isPrivate: Z.boolean(),
    });
    if (schema.safeParse(req.body.props).error) {
        // console.log(schema.safeParse(req.body.props).error);
        return res.status(400).json({msg: 'request format is not valid'});
    }

    const result = await authAction(req, 'update');
    if (result?.status == 401) {
        return res.status(result.status).json({msg: result.msg});
    }

    const owner = req.params.user;
    const response = await Snippet.editSnippet(owner, req.body.props, req.params.snippetID);
    // console.log(req.body.props);
    return response[0]?.affectedRows
        ? res.json({status: 200, msg: `snippet has been edited`})
        : res.json({status: 500, msg: `something happend while editting the snippet`});
};

const remove = async (req, res) => {
    const result = await authAction(req, 'delete');
    if (result?.status == 401) {
        return res.status(result.status).json({msg: result.msg});
    }

    const owner = req.params.user;
    const snippetID = req.params.snippetID;
    const response = await Snippet.deleteSnippet(owner, snippetID);
    // console.log('remove snippet', response);
    return response[0]?.affectedRows
        ? res.json({status: 200, msg: `snippet has been deleted`})
        : res.json({status: 500, msg: `something happend while deleting the snippet`});
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

    // console.log(snippetsResponse);
    // if empty
    if (!snippetsResponse[0]?.length) {
        return res.json({msg: {snippets: []}});
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
        const {id, user, title, descr, snippet, isPrivate, author} = snippetObj;
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
            author,
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
    // console.log(req.body.props);

    // input validation
    const schema = Z.object({
        title: Z.string(),
        descr: Z.string(),
        snippet: Z.string(),
        isPrivate: Z.boolean(),
    });
    if (schema.safeParse(req.body.props).error) {
        return res.status(400).json({msg: 'request format is not valid'});
    }

    let authorized = false;
    if (req.user.username == req.params.user) {
        authorized = true;
    } else {
        // console.log(req.params.user, req.user.username);
        const rulesResponse = await CoworkerRules.readCoworkerRules(
            req.params.user,
            req.user.username
        );
        // console.log(req.params.user);
        // if the use is not a coworker
        if (rulesResponse[0].length) {
            // check if user has the creation access
            if (rulesResponse[0][0].generic?.create) {
                authorized = true;
            }
        }
    }

    if (authorized) {
        const response = await Snippet.createSnippet({
            owner: req.params.user,
            ...req.body.props,
            author: req.user.username,
        });
        // console.log(response);
        if (response && response[0]?.affectedRows) {
            return res.json({msg: 'snippet created successfully'});
        }

        return res.status(500).json({
            msg: 'something bad happend',
        });
    }

    // this should never run
    res.status(401).json({msg: 'guess what? you can not create a snippets on others accounts'});
};

module.exports = {readMiddleware, readAll, readUserAll, read, create, edit, remove};
