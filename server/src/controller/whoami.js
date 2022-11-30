const User = require('../model/user');

const whoami = async (req, res) => {
    // console.log(req.user);
    if (req.user) {
        const userResponse = await User.getUser(req.user.username);
        // console.log('controller/whoami l:7 - ', avatarResponse)
        if (userResponse && userResponse[0].length) {
            return res.json({
                msg: {
                    username: req.user.username,
                    avatar: userResponse[0][0].avatar,
                    description: userResponse[0][0].descr,
                },
            });
        }
    }

    res.status(401).json({msg: 'unauthorized'});
};

module.exports = whoami;
