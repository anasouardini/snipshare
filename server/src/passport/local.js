const passport = require('passport');
const passportLocal = require('passport-local');
const controller = require('../controller/index');
const User = require('../model/user');
const bcrypt = require('bcrypt');

const checkCreds = async (username, password) => {
  let response = await User.userExists(username);
  // console.log(response[0]);
  if (!response[0].length) {
    return {};
  }

  const validPassword = await bcrypt.compare(password, response[0][0].passwd);
  // console.log(validPassword);
  if (validPassword) {
    return { username, password: response[0][0].passwd };
  }

  return {};
};

const passportCB = async (username, password, done) => {
  // fetch db for user and passwd
  try {
    // check creds
    const response = await checkCreds(username, password);

    if (!response) {
      throw Error('checking login gone wrong!');
    }

    if (!response.username || !response.password) {
      done(null, false, { mesage: 'bad creds' });
      return;
    }

    // console.log(response.username, response.password);

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
