const Snippet = require('../model/snippet.js');

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
	const usr = req.params.user;
	const snippetID = req.params.snippetID;

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
	const snippetsOwner = req.params.user;

	let response = await Snippet.getSnippets(snippetsOwner);
	// console.log(response[0][0].coworkers);

	// if empty
	if (!response[0].length) {
		return res.json({ msg: [] });
	}

	// if the owner is the reader
	if (snippetsOwner == req.user.username) return res.json({ msg: response[0] });

	const httpResponse = [];
	response[0].forEach((snippetObj) => {
		// console.log(snippetObj);
		const coworker = snippetObj.coworkers?.[req.user.username];
		if (snippetObj.isPrivate) {
			if (coworker && coworker.actions.includes('read')) {
				console.log(coworker.actions);
				// private but you can access it
				const { title, descr, img, snippet, isPrivate } = snippetObj;
				httpResponse.push({ title, descr, img, snippet, isPrivate, allowedActions: coworker.actions });
			} else {
				// private and no access
				const { title, img, isPrivate } = snippetObj;
				httpResponse.push({ title: title, img, isPrivate, allowedActions: ['none'] });
			}
		} else {
			// public
			const { title, descr, img, snippet, isPrivate } = snippetObj;
			httpResponse.push({ title, descr, img, snippet, isPrivate, allowedActions: snippetObj.coworkers['*'].actions });
		}
	});

	res.json({ msg: httpResponse });
};

const create = async (req, res) => {
	if (req.user.username == req.params.user) {
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
