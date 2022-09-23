const express = require('express');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('./passport/local').localStrategy;

const store = new session.MemoryStore();

const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 2000;

// midleware
app.use(
	session({
		secret: 'sdfs',
		saveUninitialized: true,
		resave: true,
		cookie: { maxAge: 1000 * 60 * 60 * 24, path: '/', secure: false, httpOnly: false },
		store,
	})
);

passport.use(localStrategy);
passport.serializeUser((usr, done) => {
	done(null, usr);
});
passport.deserializeUser((usr, done) => {
	// user the usr to get user data form db
	done(null, usr);
});
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	next();
});

const checkCreds = (req, res, next) => {
	console.log('===============');
	console.log(req.session);
	// console.log(req.sessionID);

	console.log(req.user); //ref to req.session.passport.user

	if (req?.session?.passport) {
		return res.json({ msg: 'you are already signed in' });
	}
	if (!req.body?.usr || !req.body?.passwd) {
		return res.status(400).json({ err: 'provided details are not complete' });
	}

	next();
};

// routes
// app.post('/signup', (req, res) => {
// 	if (req.session.authenticated) {
// 		return res.redirect('/shop');
// 	}
// 	res.json({ status: 'signing up', username: req.body.usr, password: req.body.passwd });
// });

app.post('/login', checkCreds, passport.authenticate('local', { failureRedirect: 'login', successRedirect: '/login' }));

// app.get('/shop', (req, res) => {
// 	res.send('this is your shitty profile ' + req.session.userSession);
// });

// 404 response
// app.use('*', (req, res) => {
// 	console.log('bad request');
// 	res.status(404).json({ err: 'nothing to see here!' });
// });

// err handling
app.use((err, erq, res, next) => {
	console.log(err);
	res.status(500).json({ err: 'something went bad' });
});

// fire up
app.listen(PORT, () => {
	console.log(`listening on port: ${PORT} from index.js`);
});
