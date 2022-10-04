const User = require('../model/user');

const readAll = async (req, res) => {
    const response = await User.readAll();

    res.json({msg: response[0].map((item) => item.user)});
};

module.exports = {readAll};
