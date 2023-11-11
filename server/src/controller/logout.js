require('dotenv').config();

const logout = async (req, res) => {
  if (req.user) {
    res.cookie(process.env.COOKIENAME, {}, { httpOnly: true, maxAge: 1 });

    return res.json({ msg: 'logging out' });
  }

  res.json({ msg: 'you are already logged out' });
};

module.exports = logout;
