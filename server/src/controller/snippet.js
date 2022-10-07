const Snippet = require('../model/snippet.js');

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

const readAll = async (req, res) => {
    const snippetsOwner = req.params.user;

    let response = await Snippet.getSnippets(snippetsOwner);
    // console.log('read all', response);
    // console.log(snippetsOwner);

    // if empty
    if (!response[0].length) {
        return res.json({msg: []});
    }

    const httpResponse = [];
    response[0].forEach((snippetObj) => {
        // console.log(snippetObj);
        if (snippetsOwner == req.user.username) {
            // the readrer is the owner
            const {id, title, descr, snippet, img, isPrivate} = snippetObj;
            httpResponse.push({
                id,
                title,
                descr,
                snippet,
                img,
                isPrivate,
                allowedActions: ['read', 'edit', 'delete'],
            });
        } else if (snippetObj.isPrivate) {
            const coworker = snippetObj.coworkers?.[req.user.username];
            if (coworker && coworker.actions.includes('read')) {
                console.log(coworker.actions);
                // private but you can access it
                const {id, title, descr, img, snippet, isPrivate} = snippetObj;
                httpResponse.push({
                    id,
                    title,
                    descr,
                    img,
                    snippet,
                    isPrivate,
                    allowedActions: coworker.actions,
                });
            } else {
                // private and no access
                const {id, title, img, isPrivate} = snippetObj;
                httpResponse.push({id, title, img, isPrivate, allowedActions: ['none']});
            }
        } else {
            // public
            const {id, title, descr, img, snippet, isPrivate} = snippetObj;
            httpResponse.push({
                id,
                title,
                descr,
                img,
                snippet,
                isPrivate,
                allowedActions: snippetObj.coworkers['*'].actions,
            });
        }
    });

    res.json({msg: httpResponse});
};

const create = async (req, res) => {
    // console.log(req.body.props);
    if (req.user.username == req.params.user) {
        const response = await Snippet.createSnippet({...req.body.props});
        console.log(response);
        if (response && response[0]?.affectedRows) {
            return res.json({msg: 'snippet created successfully'});
        }

        return res.status(500).json({
            msg: 'something bad happend',
        });
    }

    res.status(401).json({msg: 'guess what? you can not create a repository on others accounts'});
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

module.exports = {readAll, read, create, edit, remove};
