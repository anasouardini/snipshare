const User = require('../model/user');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const bcrypt = require('bcrypt');

require('dotenv').config();

const signin = async (req, res) => {
    // check inputs
    if (!req.body?.usr || !req.body?.passwd) {
        return res.status(400).json({err: 'provided details are not complete'});
    }

    // check credentials
    let response = await User.userExists(req.body.usr);

    if (!response) {
        return res.sedStatus(500);
    }

    // if password is undefined, the usr doesn't exist. but I thorw the same error
    // console.log(response[0]);
    if (!(await bcrypt.compare(req.body.passwd, response[0]?.[0]?.passwd))) {
        return res.status(401).json({msg: 'credentials are not valid'});
    }

    //gen jwt token
    const options = {algorithm: 'RS256', expiresIn: '24h'};
    const privateKey = await fs.readFile(process.cwd() + '/rsa/priv.pem');
    const body = {username: req.body.usr};
    const token = jwt.sign(body, privateKey, options);

    res.cookie(process.env.COOKIENAME, token, {httpOnly: true});

    res.json({msg: 'sign in successful'});
};

module.exports = signin;
