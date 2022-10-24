const whoami = (req, res) => {
    // console.log(req.user);
    if (req.user) {
        return res.json({msg: req.user.username});
    }

    res.status(401).json({msg: 'unauthorized'});
};

module.exports = whoami;
