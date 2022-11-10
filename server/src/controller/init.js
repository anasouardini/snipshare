const init = require('../model/init');

const restart = async (req, res) => {
    const response = await init.restart();
    console.log(response);
    if (response) {
        return res.json({msg: 'the database is re-initialized succesfully'});
    }

    res.status(500).json({msg: 'could not re initialize the db'});
};

module.exports = {restart};
