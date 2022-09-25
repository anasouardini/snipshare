const passport = require('passport');
const passportLocal = require('passport-local');
const controller = require('../controller/index');

const passportCB = async (username, password, done) => {
	// fetch db for user and passwd
	try {
		const response = controller.signin(username, password);

		if (!response) {
			throw Error('checking login gone wrong!');
		}

		if (!response.username || !response.password) {
			done(null, false, { mesage: 'bad creds' });
			return;
		}

		// console.log(username, password);

		done(null, response);
	} catch (err) {
		done(err);
	}
};
const fieldsNames = { usernameField: 'usr', passwordField: 'passwd' };

const localStrategy = new passportLocal.Strategy(fieldsNames, passportCB);

passport.use(localStrategy);
passport.serializeUser((usr, done) => {
	done(null, usr);
});
passport.deserializeUser((usr, done) => {
	// user the usr to get user data form db
	done(null, usr);
});

module.exports = passport;
