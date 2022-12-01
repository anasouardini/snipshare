const User = require('../model/user');
require('dotenv').config();

const readAll = async (req, res) => {
    const response = await User.readAll();

    res.json({msg: response[0].map((item) => item.user)});
};

const editUser = async (req, res) => {
    // console.log('edit user, l10', req.file);
    // only one of then is sent from the client, others are undefined.
    const newUsername = req.body?.username;
    const newDescription = req.body?.description;

    // all are sent to the model, but only the truthy one will be updated
    let userNewInfo = {newUsername, newDescription};

    if (newUsername) {
        const userResponse = await User.getUser(newUsername);
        if (!userResponse) {
            return res.sedStatus(500);
        }
        if (userResponse[0].length) {
            return res.status(400).json({msg: 'this username already exists'});
        }
    } else if (req.file) {
        // todo: save avatar file with the user's username, and set url in a variable
        const newAvatarUrl = 'http://127.0.0.1:2000/media/avatars/' + req.file.filename;
        userNewInfo.newAvatar = newAvatarUrl;
    }

    const userEditRes = await User.editUser(req.user.username, userNewInfo);
    console.log(userEditRes);

    if (userEditRes == undefined) {
        return res.status(500).json({msg: 'you have to provide a value'});
    }
    if (!userEditRes || !userEditRes[0].affectedRows) {
        return res.status(500).json({msg: 'something bad happened during profile editting'});
    }

    if (newUsername) {
        res.clearCookie(process.env.COOKIENAME);
    }
    res.json({msg: 'profile has been modified successfullly'});
};

module.exports = {readAll, editUser};
