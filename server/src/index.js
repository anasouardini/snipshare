const express = require('express');
const session = require('express-session');
const cookie = require('cookie-parser');
// const passport = require('passport');
// const localStrategy = require('./passport/local').localStrategy;
// const cors = require('cors');// not necessary

const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 2000;

// passport.serializeUser((usr, done) => {
// 	done(null, usr);
// });
// passport.deserializeUser((usr, done) => {
// 	done(null, usr);
// });

// // midleware
// passport.use(localStrategy);
// app.use(passport.initialize());

// const store = new session.MemoryStore();

// Cross Origin Resource Sharing
// const whitelist = ['http://127.0.0.1:3000'];
// const corsOptions = {
// 	origin: (origin, callback) => {
// 		if (whitelist.indexOf(origin) !== -1 || !origin) {
// 			callback(null, true);
// 		} else {
// 			callback(new Error('Not allowed by CORS'));
// 		}
// 	},
// 	optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	next();
});

app.use(cookie());
app.use(
	session({
		secret: 'secretgf',
		saveUninitialized: true,
		resave: true,
		cookie: { maxAge: 1000 * 60 * 60 * 24, path: '/', secure: false, httpOnly: false },
		// store,
	})
);

const checkCreds = (req, res, next) => {
	if (!req.body?.usr || !req.body?.passwd) {
		res.status(400).json({ err: 'provided details are not complete' });
		return;
	}

	next();
};

// routes
app.post('/signup', (req, res) => {
	if (req.session.authenticated) {
		return res.redirect('/shop');
	}
	res.json({ status: 'signing up', username: req.body.usr, password: req.body.passwd });
});

app.post('/login', (req, res) => {
	// req.session.userSession = { username: req.user.username, dateCreated: new Date() };// for passportjs
	// console.log(req.session);

	if (req.session?.authenticated) {
		return res.json({ loggedin: true });
	}

	req.session.authenticated = true;
	req.session.userSession = { username: req.body.usr, dateCreated: new Date() };
	req.session.save();

	return res.json({ loggedin: true });
});

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
