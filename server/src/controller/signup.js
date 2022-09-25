const User = require('../model/user');
const { response } = require('../utils/constants');

const signup = async (req, res) => {
	const response = await User.userExists(req.body.usr);
	console.log(response);
	// if (res) {
	// 	res.status(response.duplicateInputs.status).json({ inputs: [req.usr] });
	// }
	res.json({ msg: 'account created' });
};

module.exports = signup;
