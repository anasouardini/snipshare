const whoami = (req, res) => {
    if (req.user) {
        return res.json({msg: req.user.username});
    }

    res.status(401).json({msg: 'unauthorized'});
};

module.exports = whoami;
