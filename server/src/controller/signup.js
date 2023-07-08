const User = require('../model/user');
const bcrypt = require('bcrypt');
const {v4: uuid} = require('uuid');

const signup = async (req, res) => {
    // check inputs
    if (!req.body?.usr || !req.body?.passwd) {
        return res.status(400).json({err: 'provided details are not complete'});
    }

    // chekc if the username exists in the mods table
    const modResponse = await User.getMod(req.body.usr);
    // console.log(modResponse)

    if (!modResponse) {
        return res.sedStatus(500);
    }

    if (modResponse[0].length) {
        return res.status(400).json({msg: 'this username already exists'});
    }

    // chekc if the username exists in the users table
    const userResponse = await User.getUser(req.body.usr);

    if (!userResponse) {
        return res.sedStatus(500);
    }

    if (userResponse[0].length) {
        return res.status(400).json({msg: 'this username already exists'});
    }

    const hash = await bcrypt.hash(req.body.passwd, 10);
    const createUserResponse = await User.createUser({id: uuid(), usr: req.body.usr, pass: hash});

    if (!createUserResponse[0]?.affectedRows) {
        return res.status(500).json({msg: 'something went bad while signing up'});
    }

    res.json({msg: 'account successfuly created'});
};

module.exports = signup;
