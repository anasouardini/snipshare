const router = require('express').Router();
const controller = require('../controller');
const passport = require('../passport/local');

const checkAuth = (req, res, next) => {
	// console.log('checking auth');
	if (req.params?.check) {
		return res.json({ signedIn: !!req?.session?.passport });
	}

	next();
};

const loginMiddleware = (req, res, next) => {
	if (req?.session?.passport) {
		return res.json({ msg: 'you are already signed in' });
	}

	next();
};

const afterLoginMiddleware = (req, res, next) => {
	if (!req?.session?.passport) {
		return res.status(401).json({ msg: 'you have to sign in first' });
	}

	next();
};

const checkCreds = (req, res, next) => {
	if (!req.body?.usr || !req.body?.passwd) {
		return res.status(400).json({ err: 'provided details are not complete' });
	}

	next();
};

//auth
router.post('/signin', checkAuth, loginMiddleware, checkCreds, passport.authenticate('local'), controller.signin);
router.post('/signup', checkAuth, loginMiddleware, checkCreds, controller.signup);
//snippets
router.get('/:user/snippets', checkAuth, afterLoginMiddleware, controller.snippet.readAll);
router.get('/:user/:snippetID', checkAuth, afterLoginMiddleware, controller.snippet.read);
router.post('/:user/:snippetID', checkAuth, afterLoginMiddleware, controller.snippet.create);
router.put('/:user/:snippetID', checkAuth, afterLoginMiddleware, controller.snippet.edit);
router.delete('/:user/:snippetID', checkAuth, afterLoginMiddleware, controller.snippet.remove);

module.exports = router;
