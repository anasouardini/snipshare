const User = require('../model/user');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const bcrypt = require('bcrypt');

const axios = require('axios');
const qs = require('qs');

require('dotenv').config();

const signinMod = async (req, res) => {
    // check credentials in mods table
    const modResponse = await User.getMod(req.body.usr);

    if (!modResponse) {
        return res.sendStatus(500);
    }

    if (modResponse[0].length) {
        // console.log(modResponse[0]);
        if (await bcrypt.compare(req.body.passwd, modResponse[0][0].passwd)) {
            const options = {algorithm: 'RS256', expiresIn: '24h'};
            const privateKey = await fs.readFile(process.cwd() + '/rsa/priv.pem');
            const body = {username: req.body.usr};
            const token = jwt.sign(body, privateKey, options);

            res.cookie(process.env.COOKIENAME, token, {httpOnly: true});

            return res.json({msg: 'sign in successful'});
        }
    }

    return res.status(401).json({msg: 'credentials are not valid'});
};

const signinUser = async (req, res, next) => {
    // check inputs
    if (!req.body?.usr || !req.body?.passwd) {
        return res.status(400).json({err: 'provided details are not complete'});
    }

    // check credentials in users table
    const userResponse = await User.getUser(req.body.usr);
    // console.log(userResponse);

    if (!userResponse) {
        return res.sendStatus(500);
    }

    if (userResponse[0].length) {
        // console.log(userResponse[0]);
        if (await bcrypt.compare(req.body.passwd, userResponse[0][0].passwd)) {
            const options = {algorithm: 'RS256', expiresIn: '24h'};
            const privateKey = await fs.readFile(process.cwd() + '/rsa/priv.pem');
            const body = {username: req.body.usr};
            const token = jwt.sign(body, privateKey, options);

            res.cookie(process.env.COOKIENAME, token, {httpOnly: true});

            return res.json({msg: 'sign in successful'});
        }
    }

    next();
};

const signinOAuth = async (req, res) => {
    if (req.query?.code) {
        const accessTokenRequest = {
            code: req.query.code,
            client_id: process.env.AUTH_GOOGLE_ID,
            client_secret: process.env.AUTH_GOOGLE_SECRET,
            redirect_uri: process.env.AUTH_GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code',
        };
        const response = await axios
            .post(process.env.AUTH_GOOGLE_TOKEN_ENDPOINT, accessTokenRequest, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            })
            .then((res) => res.data)
            .catch((error) => ({error: error.response.data.error}));

        if (response?.error) {
            return res.redirect(`http://127.0.0.1:3000/login?error=oauth2 error`);
        }

        const {email, email_verified} = jwt.decode(response.id_token);

        // UPSERTING EMAIL AS THE USERNAME
        const userResponse = await User.getUser(email);
        if (!userResponse)
            return res.status(500).json({msg: 'something bad happened while authenticating you'});
        if (!userResponse[0].length) {
            console.log('user does not exist');
            // creating the user
            const createUserResponse = await User.createUser(email, 'OAuth2.0 user');
            if (!createUserResponse[0]?.affectedRows) {
                return res.status(500).json({msg: 'something went bad while signing up'});
            }
        }

        const options = {algorithm: 'RS256', expiresIn: '24h'};
        const privateKey = await fs.readFile(process.cwd() + '/rsa/priv.pem');
        const body = {username: email};
        const token = jwt.sign(body, privateKey, options);

        console.log('setting the cookie');
        res.cookie(process.env.COOKIENAME, token, {httpOnly: true});

        return res.redirect(`http://127.0.0.1:3000/login`);
    }

    // NO ID TOKEN, REDIRECTING TO THE CONSENT SCREEN
    const consentData = {
        client_id: process.env.AUTH_GOOGLE_ID,
        response_type: 'code',
        redirect_uri: process.env.AUTH_GOOGLE_REDIRECT_URI,
        scope: 'email',
        nonce: '161581761691-3tjdu1rca5q35h60qcgrd7eb0tb2ulmpakonamatata',
    };

    res.redirect(`${process.env.AUTH_GOOGLE_CODE_ENDPOINT}?${new URLSearchParams(consentData)}`);
};

module.exports = {signinUser, signinMod, signinOAuth};
