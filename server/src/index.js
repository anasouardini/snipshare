const express = require('express');
const session = require('express-session');
const passport = require('./passport/local');
const router = require('./routes');
const cors = require('cors');

const store = new session.MemoryStore();

const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 2000;

// midleware

app.use(cors({ origin: ['http://127.0.0.1:3000'], credentials: true }));

app.use(
	session({
		secret: process.env.SECRET,
		saveUninitialized: true,
		resave: true,
		cookie: { maxAge: 1000 * 60 * 60 * 24, path: '/', secure: false, httpOnly: false },
		store,
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// router
app.use('/', router);

// 404 response
app.use('*', (req, res) => {
	// console.log('bad request 404');
	res.status(404).json({ err: 'nothing to see here!' });
});

// err handling
app.use((err, erq, res, next) => {
	console.log(err);
	res.status(500).json({ err: 'something went bad' });
});

// fire up
app.listen(PORT, () => {
	console.log(`listening on port: ${PORT} from index.js`);
});
