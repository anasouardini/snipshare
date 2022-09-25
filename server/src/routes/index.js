const router = require('express').Router();
const controller = require('../controller');
const passport = require('../passport/local');

const checkAuth = (req, res, next) => {
	console.log('checking auth');
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

router.post('/login', checkAuth, checkCreds, passport.authenticate('local'));
router.post('/signup', checkAuth, checkCreds, controller.signup);
router.post('/shop', controller.shop);

module.exports = router;
