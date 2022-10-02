const router = require('express').Router();
const controller = require('../controller');
// const passport = require('../passport/local');

const gotoLogin = (req, res, next) => {
	// if not logged in
	if (!req?.user) {
		return res.json({ redirect: '/login' });
	}

	next();
};

const gotoHome = (req, res, next) => {
	//if already logged in
	// console.log(req.user);
	if (req?.user) {
		return res.json({ redirect: '/' });
	}

	next();
};

//auth
router.post('/signin', gotoHome, controller.signin);
router.post('/signup', gotoHome, controller.signup);
//snippets
router.get('/:user/snippets', gotoLogin, controller.snippet.readAll);
router.get('/:user/:snippetID', gotoLogin, controller.snippet.read);
router.post('/:user/', gotoLogin, controller.snippet.create);
router.put('/:user/:snippetID', gotoLogin, controller.snippet.edit);
router.delete('/:user/:snippetID', gotoLogin, controller.snippet.remove);

module.exports = router;
