const init = require('../model/init');

const restart = async (req, res) => {
  const response = await init.restart();
  console.log(response);
  if (!response.err) {
    if (response.state.initializing) {
      return res.json({ msg: 'be patient, the DB is being re-initialized' });
    }
    return res.json({ msg: 'the database has been re-initialized succesfully' });
  }

  res.status(500).json({ msg: 'could not re initialize the db' });
};

module.exports = { restart };
