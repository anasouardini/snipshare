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

const signinOAuth = (req, res) => {
    if (req.query?.idToken) {
        console.log('got the JWT');
        return res.json({msg: 'processing the the user profile'});
    }

    console.log('redirecting to the consent');

    const toUrlEncoded = (obj) =>
        Object.keys(obj)
            .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
            .join('&');

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

    res.redirect(`${consentData.endPoint}?${toUrlEncoded(consentData.query)}`);
};

module.exports = {signinUser, signinMod, signinOAuth};
