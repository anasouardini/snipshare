const User = require('../model/user');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const bcrypt = require('bcrypt');

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
    if (req.query?.idToken) {
        const {email, email_verified} = jwt.decode(req.query?.idToken);

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

        return res.json({msg: 'sign in successful with google OAuth2.0'});
    }

    // NO ID TOKEN, REDIRECTING TO THE CONSENT SCREEN
    // const toUrlEncoded = (obj) =>
    //     Object.keys(obj)
    //         .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
    //         .join('&');

    const consentData = {
        endPoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        query: {
            client_id: '161581761691-3tjdu1rca5q35h60qcgrd7eb0tb2ulmp.apps.googleusercontent.com',
            response_type: 'id_token', //implicit flow (openid connect)
            redirect_uri: 'http://127.0.0.1:3000/login',
            scope: 'openid profile email', // OIDC => email + profile

            nonce: 'akonamatata',
            // state: 'I need a unique session token',
        },
    };

    res.redirect(`${consentData.endPoint}?${new URLSearchParams(consentData.query)}`);
};

module.exports = {signinUser, signinMod, signinOAuth};
