const Snippet = require('../model/snippet');

const actions = {
	read: async (snippetID, action) => {
		let response = await Snippet.getSnippet(snippetID);
		return response[0][0].coworkers.actions.includes(action)
			? response[0][0]
			: { status: 401, msg: `you can not authorized to ${action} this snippet` };
	},
	edit: async (snippetID, action, props) => {
		let response = await Snippet.getSnippet(snippetID);
		if (response[0][0].coworkers.actions.includes(action)) {
			response = await Snippet.editSnippet(snippetID, props);
			return response[0]?.affectedRows
				? { status: 200, msg: `snippet has been ${action}ed` }
				: { status: 500, msg: `something happend while ${action}ing the snippet` };
		}

		return { status: 401, msg: `you are not authorized to ${action} this snippet` };
	},
	delete: async (snippetID, action) => {
		let response = await Snippet.getSnippet(snippetID);
		if (response[0][0].coworkers.actions.includes(action)) {
			response = await Snippet.deleteSnippet(snippetID);
			return response[0]?.affectedRows
				? { status: 200, msg: `snippet has been ${action}ed` }
				: { status: 500, msg: `something happend while ${action}ing the snippet` };
		}

		return { status: 401, msg: `you are not authorized to ${action} this snippet` };
	},
};

const authAction = async (req, action) => {
	const usr = req.query.params.user;
	const snippetID = req.query.params.snippetID;

	let response = await Snippet.getSnippet(snippetID);
	return response[0].length
		? response[0][0].coworkers.includes(usr)
			? action == 'edit'
				? actions[action](snippetID, action, req.body.props)
				: actions[action](snippetID, action)
			: { status: 401, msg: `you can not authorized to interact this snippet` }
		: { status: 404, msg: `this snippet doen't exist` };
};

const readAll = async (req, res) => {
	const usr = req.query.params.user;
	const snippetID = req.query.params.snippetID;

	let response = await Snippet.getSnippets();
	response[0].map((snippet) => (!snippet.coworkers.includes(usr) ? {} : !snippet.coworkers.actions.includes('read') ? {} : snippet));
	res.json({ msg: 'this is still not constructed' });
};

const create = async (req, res) => {
	if (req.user.username == req.query.params.user) {
		let response = await Snippet.createSnippet({ title: '', descr: '', img: '', isPrivate: true, coworkers: [] });
		return res.json({ msg: 'this is still not constructed' });
	}
	// in theory... this line would never get executed
	res.json({ msg: "you can not make snippets on other user's account" });
};

const read = async (req, res) => {
	const result = authAction(req, 'read');
	res.status(result.status).json({ msg: result.msg });
};

const edit = (req, res) => {
	const result = authAction(req, 'edit');
	res.status(result.status).json({ msg: result.msg });
};

const remove = (req, res) => {
	const result = authAction(req, 'remove');
	res.status(result.status).json({ msg: result.msg });
};

module.exports = { readAll, read, create, edit, remove };
