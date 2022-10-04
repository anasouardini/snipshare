const express = require('express');
const router = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs/promises');
const jwt = require('jsonwebtoken');

const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 2000;

// midleware

app.use(cors({origin: ['http://127.0.0.1:3000'], credentials: true}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//check auth
app.use(async (req, res, next) => {
    // console.log('res.cookie', res?.cookie);
    const token = req?.cookies?.[process.env.COOKIENAME];
    if (token) {
        // console.log(token);
        try {
            const usr = jwt.verify(token, await fs.readFile(process.cwd() + '/rsa/pub.pem'));
            req.user = usr;
        } catch (e) {
            // console.log(e);
        }
    }

    next();
});

// router
app.use('/', router);

// 404 response
app.use('*', (req, res) => {
    // console.log('bad request 404');
    res.status(404).json({err: 'nothing to see here!'});
});

// err handling
app.use((err, erq, res, next) => {
    console.log(err);
    res.status(500).json({err: 'something went bad'});
});

// fire up
app.listen(PORT, () => {
    console.log(`listening on port: ${PORT} from index.js`);
});
