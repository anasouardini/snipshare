const whoami = (req, res) => {
    if (req.user) {
        res.json({msg: req.user.username});
    }
};

module.exports = whoami;
