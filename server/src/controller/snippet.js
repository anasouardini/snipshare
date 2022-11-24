const Snippet = require('../model/snippet.js');
const CoworkerRules = require('../model/coworkersRules.js');
const User = require('../model/user.js');
const Z = require('zod');
const {v4: uuid} = require('uuid');

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
        const snippetResponse = await Snippet.getSnippet(owner, snippetID);
        //console.log('l24 ',snippetResponse)
        if (!snippetResponse[0].length) return defaultResponse;

        let access = {};

        if (owner == usr) {
            access = {read: true, update: true, delete: true};
        } else {
            rulesResponse = await CoworkerRules.readCoworkerRules(owner, usr);

            if (snippetResponse[0][0].isPrivate) {
                // console.log(rulesResponse[0]?.[0]?.exceptions);
                let hasReadAccess =
                    rulesResponse[0]?.[0]?.exceptions?.[snippetID]?.[action] ||
                    rulesResponse[0]?.[0]?.generic?.[action] ||
                    false;

                if (!hasReadAccess) return defaultResponse;

                access =
                    rulesResponse[0][0].exceptions?.[snippetID] || rulesResponse[0][0]?.generic;
            } else {
                access = rulesResponse[0]?.[0]?.exceptions?.[snippetID] ||
                    rulesResponse[0]?.[0]?.generic || {read: true, update: false, delete: false};
            }
        }

        const {id, user, title, descr, snippet, isPrivate, author, language, categories} =
            snippetResponse[0][0];
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
                language,
                categories,
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
    res.status(result.status).json({msg: result.msg});
};

const edit = async (req, res) => {
    // input validation
    const schema = Z.object({
        title: Z.string().max(100),
        descr: Z.string().max(1000),
        snippet: Z.string().max(1000),
        isPrivate: Z.boolean(),
    });

    //console.log(req.body.props)
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
    // console.log(response);
    return response[0]?.affectedRows
        ? res.json({status: 200, msg: `snippet has been edited`})
        : res.json({status: 500, msg: `something happend while editting the snippet`});
};

const remove = async (req, res) => {
    const result = await authAction(req, 'delete');
    if (result?.status == 401) {
        return res.status(result.status).json({msg: result.msg});
    }

    const user = req.user.username;
    const owner = req.params.user;
    const snippetID = req.params.snippetID;
    const response = await Snippet.deleteSnippet(owner, snippetID);
    // console.log('remove snippet', response);
    if (response[0]?.affectedRows) {
        // read coworker rules
        const rulesResponse = await CoworkerRules.readCoworkerRules(owner, user);
        // console.log(owner);
        // if the use is not a coworker
        // console.log(rulesResponse);
        if (rulesResponse[0].length) {
            const rules = rulesResponse[0][0];
            rules.coworker = user;
            // update rules
            delete rules.exceptions[snippetID];
            const updateCoworkerRuleResult = await CoworkerRules.update(owner, rules);
            if (updateCoworkerRuleResult?.[0].length) {
                return res.status(500).json({
                    msg: 'snippet was deleted, but you do not have access to it explicitly',
                });
            }
        }

        return res.json({msg: `snippet has been deleted successfully`});
    }

    return res.status(500).json({msg: `something happend while deleting the snippet`});
};

// ____________________________

const readMiddleware = async (req, res) => {
    const snippetsOwner = req.params?.user; // if  this is not specified, the user is requesting all of the snippets
    const user = req.user.username;
    const filters = {
        title: req.query?.title,
        language: req.query?.language,
        categories: (() => {
            if (!req.query?.categories) {
                return undefined;
            }
            const categories = req.query?.categories?.trim();
            if (categories[categories.length - 1] == ',') {
                return categories.slice(0, categories.length - 1);
            }
        })(),
    };
    console.log(filters);

    const snippetsResponse = snippetsOwner
        ? await Snippet.getUserSnippets({user: snippetsOwner, ...filters})
        : await Snippet.getAllSnippets({...filters});

    // console.log(snippetsResponse);
    // if empty
    if (!snippetsResponse[0]?.length) {
        res.json({msg: {snippets: []}});
        return false;
    }

    let filteredSnippets = snippetsResponse[0];

    req.snippets = filteredSnippets;

    // get coworkers rules
    let rulesResponse = {};
    if (snippetsOwner) {
        rulesResponse = await CoworkerRules.readCoworkerRules(snippetsOwner, user);
        // if the use is not a coworker
        if (!rulesResponse[0].length) {
            req.rules = [];
            return;
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
            res.status(500).json({msg: 'something happned while getting the data'});
            return false;
        }

        // get all the rules
        req.rules = rulesResponse[0].reduce((acc, rule) => {
            acc[rule.user] = rule;
            return acc;
        }, {});
    }
};

const appendSnippetToResponse = (req, filteredSnippets, snippetObj, access) => {
    // console.log(snippetObj);
    if (access?.read) {
        const {id, user, title, descr, snippet, isPrivate, author, language, categories} =
            snippetObj;
        if (req.query?.meta) {
            filteredSnippets.push({
                id,
                title,
            });
            return;
        }
        filteredSnippets.push({
            id,
            user,
            title,
            descr,
            snippet,
            isPrivate,
            author,
            language,
            categories,
            access,
        });
    }
};

const readUserAll = async (req, res) => {
    //- needs to be exactly false
    if (false == (await readMiddleware(req, res))) return;
    const pageParam = Number(req.query.pageParam);
    const perPage = Number(req.query.perPage);
    const genericAccess = req.rules.generic;
    // console.log(req.snippets);
    // filter snippets according to rules
    const filteredSnippets = [];
    req.snippets.forEach((snippetObj) => {
        if (snippetObj.user == req.user.username) {
            appendSnippetToResponse(req, filteredSnippets, snippetObj, {
                read: true,
                update: true,
                delete: true,
            });
        } else {
            if (!snippetObj.isPrivate && !Object.keys(req.rules).length) {
                // if no rule, and snippet is public: access is read-only
                appendSnippetToResponse(req, filteredSnippets, snippetObj, {read: true});
            } else {
                if (Object.keys(req.rules).length) {
                    // if there is an exception for the snippet, apply the exception rule
                    const exceptionRule = req.rules.exceptions[snippetObj.id];
                    if (req.rules.exceptions?.[snippetObj.id]) {
                        appendSnippetToResponse(req, filteredSnippets, snippetObj, exceptionRule);
                    } else {
                        // if there is no exception, then apply the generic acess rule
                        appendSnippetToResponse(
                            req,
                            filteredSnippets,
                            snippetObj,
                            req.rules.generic
                        );
                    }
                }
            }
        }
    });
    // console.log(filteredSnippets);

    //console.log(pageParam, perPage);
    res.json({
        msg: {
            nextPage: filteredSnippets.length / perPage <= pageParam ? undefined : pageParam + 1,
            snippets: filteredSnippets.slice((pageParam - 1) * perPage, pageParam * perPage),
            genericAccess,
        },
    });
};

const readAll = async (req, res) => {
    //- needs to be exactly false
    if (false == (await readMiddleware(req, res))) return;

    const pageParam = Number(req.query.pageParam);
    const perPage = Number(req.query.perPage);
    const user = req.user.username;
    const isUserMod = Boolean((await User.getMod(user))[0].length);

    // filter snippets according to rules
    const filteredSnippets = [];
    req.snippets.forEach((snippetObj) => {
        if (user == snippetObj.user || isUserMod) {
            appendSnippetToResponse(req, filteredSnippets, snippetObj, {
                read: true,
                update: true,
                delete: true,
            });
        } else {
            // console.log(req.rules);
            if (!snippetObj.isPrivate && !req.rules?.[snippetObj.user]) {
                // if no rule, and snippet is public: access is read-only
                appendSnippetToResponse(req, filteredSnippets, snippetObj, {read: true});
            } else {
                if (req.rules?.[snippetObj.user]) {
                    // if there is an exception for the snippet, apply the exception rule
                    if (req.rules[snippetObj.user].exceptions?.[snippetObj.id]) {
                        const exceptionRule =
                            req.rules[snippetObj.user].exceptions?.[snippetObj.id];
                        appendSnippetToResponse(req, filteredSnippets, snippetObj, exceptionRule);
                    } else {
                        // if there is no exception, then apply the generic acess rule
                        const genericRule = req.rules[snippetObj.user].generic;
                        appendSnippetToResponse(req, filteredSnippets, snippetObj, genericRule);
                    }
                }
            }
        }
    });

    //console.log(pageParam, perPage);
    res.json({
        msg: {
            nextPage: filteredSnippets.length / perPage <= pageParam ? undefined : pageParam + 1,
            snippets: filteredSnippets.slice((pageParam - 1) * perPage, pageParam * perPage),
        },
    });
};

const create = async (req, res) => {
    const owner = req.params.user;
    const coworker = req.user.username;

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

    let rulesResponse = undefined;
    let authorized = 0;
    if (coworker == owner) {
        authorized = 1;
    } else {
        // console.log(owner, coworker);
        rulesResponse = await CoworkerRules.readCoworkerRules(owner, coworker);
        // console.log(owner);
        // if the use is not a coworker
        if (rulesResponse[0].length) {
            // check if user has the creation access
            if (rulesResponse[0][0].generic?.create) {
                authorized = 2;
            }
        }
    }

    if (authorized) {
        const snippetRandomID = uuid();
        // console.log('uuid', snippetRandomID);
        const response = await Snippet.createSnippet({
            id: snippetRandomID,
            owner: owner,
            ...req.body.props,
            author: coworker,
        });
        // console.log(response);
        if (response && response[0]?.affectedRows) {
            // if the author is a coworker
            // giving the coworker access to the snippet they've created
            if (authorized == 2) {
                // read coworker rules
                const rules = rulesResponse[0][0];
                rules.coworker = coworker;
                // update rules
                rules.exceptions[snippetRandomID] = {
                    read: true,
                    update: true,
                    delete: true,
                };
                const updateCoworkerRuleResult = await CoworkerRules.update(owner, rules);
                if (updateCoworkerRuleResult?.[0].length) {
                    return res.status(500).json({
                        msg: 'snippet was created, but you do not have access to it explicitly',
                    });
                }
            }
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
