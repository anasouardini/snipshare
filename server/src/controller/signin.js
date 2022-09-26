const User = require('../model/user');
const bcrypt = require('bcrypt');

const signin = async (req, res) => {
	res.json({ msg: 'login is successful' });
};

module.exports = signin;
