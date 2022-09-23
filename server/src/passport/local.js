const passportLocal = require('passport-local');

// use bcrypt
const checkLogin = (username, password) => ({ username, password, test: 'test' });

const passportCB = async (username, password, done) => {
	// fetch db for user and passwd
	try {
		const response = checkLogin(username, password);

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

module.exports = {
	localStrategy,
};
