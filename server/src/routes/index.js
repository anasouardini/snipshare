const router = require('express').Router();
const controller = require('../controller');
const passport = require('../passport/local');

const checkAuth = (req, res, next) => {
	// console.log('checking auth');
	if (req.params?.check) {
		return res.json({ signedIn: !!req?.session?.passport });
	}

	if (req?.session?.passport) {
		return res.json({ msg: 'you are already signed in' });
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
router.post('/signin', checkAuth, checkCreds, passport.authenticate('local'), controller.signin);
router.post('/signup', checkAuth, checkCreds, controller.signup);
//snippets
router.get('/:user/snippets', checkAuth, controller.snippet.readAll);
router.get('/:user/:snippetID', checkAuth, controller.snippet.read);
router.post('/:user/:snippetID', checkAuth, controller.snippet.create);
router.put('/:user/:snippetID', checkAuth, controller.snippet.edit);
router.delete('/:user/:snippetID', checkAuth, controller.snippet.remove);

module.exports = router;
