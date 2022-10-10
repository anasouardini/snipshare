const User = require('../model/user');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const bcrypt = require('bcrypt');
const {nextTick} = require('process');

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

module.exports = {signinUser, signinMod};
