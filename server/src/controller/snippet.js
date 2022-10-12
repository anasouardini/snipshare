const Snippet = require('../model/snippet.js');
const CoworkerRules = require('../model/coworkersRules.js');
const User = require('../model/user.js');

const actions = {
    read: async (owner, usr, snippetID, action) => {
        let response = await Snippet.getSnippet(owner, snippetID);
        return response[0][0].coworkers[usr].actions.includes(action)
            ? response[0][0]
            : {status: 401, msg: `you are not authorized to ${action} this snippet`};
    },
    edit: async (owner, usr, snippetID, action, props) => {
        let response = await Snippet.getSnippet(owner, snippetID);
        // console.log(response[0][0]);
        if (response[0][0].coworkers[usr].actions.includes(action)) {
            response = await Snippet.editSnippet(owner, props);
            console.log(response);
            return response[0]?.affectedRows
                ? {status: 200, msg: `snippet has been ${action}ed`}
                : {status: 500, msg: `something happend while ${action}ing the snippet`};
        }

        return {status: 401, msg: `you are not authorized to ${action} this snippet`};
    },
    delete: async (owner, usr, snippetID, action) => {
        let response = await Snippet.getSnippet(owner, snippetID);
        if (response[0][0].coworkers[usr].actions.includes(action)) {
            response = await Snippet.deleteSnippet(owner, snippetID);
            return response[0]?.affectedRows
                ? {status: 200, msg: `snippet has been ${action}ed`}
                : {status: 500, msg: `something happend while ${action}ing the snippet`};
        }

        return {status: 401, msg: `you are not authorized to ${action} this snippet`};
    },
};

const authAction = async (req, action) => {
    const owner = req.params.user;
    const usr = req.user.username;
    const snippetID = req.params.snippetID;

    // if the user is the owner
    if (owner == usr) {
        const response = await Snippet.deleteSnippet(owner, snippetID);
        console.log(response);
        return response[0]?.affectedRows
            ? {status: 200, msg: `snippet has been ${action}ed`}
            : {status: 500, msg: `something happend while ${action}ing the snippet`};
    }

    // if the user is the not the owner, can't modify certain fields
    if (action == 'edit') {
        if (req.body?.isPrivate) {
            delete req.body.isPrivate;
        }
        if (req.body?.coworkers) {
            delete req.body.coworkers;
        }
    }

    // console.log(req.body.props);
    let response = await Snippet.getSnippet(owner, snippetID);
    // console.log(snippetID);
    const rr = response[0].length
        ? response[0][0].coworkers?.[usr]
            ? actions[action](owner, usr, snippetID, action, req.body.props)
            : {status: 401, msg: `you are not authorized to interact with this snippet`}
        : {status: 404, msg: `this snippet doen't exist`};

    return rr;
};

const readMiddleware = async (req, res, next) => {
    const snippetsOwner = req.params.user; // if  this is not specified, the user is requesting all of the snippets
    const user = req.user.username;

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
        rulesResponse = await CoworkerRules.readUserRules(snippetsOwner, user);
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
        rulesResponse = await CoworkerRules.readAllRules(user);
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

const appendSnippet = (filteredSnippets, snippetObj, access) => {
    if (access.includes('r')) {
        const {id, user, title, descr, snippet, isPrivate} = snippetObj;
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
    // console.log(req.snippets);
    // filter snippets according to rules
    const filteredSnippets = [];
    req.snippets.forEach((snippetObj) => {
        if (snippetObj.user == req.user.username) {
            appendSnippet(filteredSnippets, snippetObj, 'rud');
        } else {
            if (!snippetObj.isPrivate && !Object.keys(req.rules).length) {
                // if no rule, and snippet is public: access is read-only
                appendSnippet(filteredSnippets, snippetObj, 'r');
            } else {
                if (Object.keys(req.rules).length) {
                    // if there is an exception for the snippet, apply the exception rule
                    const exceptionRule = req.rules.exceptions[snippetObj.id];
                    if (req.rules.exceptions?.[snippetObj.id]) {
                        appendSnippet(filteredSnippets, snippetObj, exceptionRule);
                    } else {
                        // if there is no exception, then apply the generic acess rule
                        appendSnippet(filteredSnippets, snippetObj, req.rules.generic);
                    }
                }
            }
        }
    });
    // console.log(filteredSnippets);

    res.json({msg: filteredSnippets});
};

const readAll = async (req, res) => {
    const user = req.user.username;
    const isUserMod = Boolean((await User.getMod(user))[0].length);

    // filter snippets according to rules
    const filteredSnippets = [];
    req.snippets.forEach((snippetObj) => {
        if (user == snippetObj.user || isUserMod) {
            appendSnippet(filteredSnippets, snippetObj, 'rud');
        } else {
            if (!snippetObj.isPrivate && !req.rule?.[snippetObj.user]) {
                // if no rule, and snippet is public: access is read-only
                appendSnippet(filteredSnippets, snippetObj, 'r');
            } else {
                if (req.rule?.[snippetObj.user]) {
                    // if there is an exception for the snippet, apply the exception rule
                    if (req.rule[snippetObj.user].exceptions?.[snippetObj.id]) {
                        const exceptionRule = req.rule[snippetObj.user].exceptions?.[snippetObj.id];
                        appendSnippet(filteredSnippets, snippetObj, exceptionRule);
                    } else {
                        // if there is no exception, then apply the generic acess rule
                        const genericRule = req.rule[snippetObj.user].generic;
                        appendSnippet(filteredSnippets, snippetObj, genericRule);
                    }
                }
            }
        }
    });

    res.json({msg: filteredSnippets});
};

const create = async (req, res) => {
    console.log(req.body.props.coworkers);

    if (req.user.username == req.params.user) {
        const response = await Snippet.createSnippet({user: req.user.username, ...req.body.props});
        console.log(response);
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

const read = async (req, res) => {
    const result = await authAction(req, 'read');
    res.status(result.status).json({msg: result.msg});
};

const edit = async (req, res) => {
    const result = await authAction(req, 'edit');
    console.log(result);
    res.status(result.status).json({msg: result.msg});
};

const remove = async (req, res) => {
    const result = await authAction(req, 'delete');
    res.status(result.status).json({msg: result.msg});
};

module.exports = {readMiddleware, readAll, readUserAll, read, create, edit, remove};
