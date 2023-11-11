const Languages = require('../model/languages.js');

const readAll = async (req, res) => {
  const languagesResponse = await Languages.getAllLanguages();

  if (languagesResponse) {
    const languagesArr = languagesResponse[0].map(obj => obj.name);
    // console.log(languagesArr)
    return res.json({ msg: languagesArr });
  }

  return res
    .status(500)
    .json({
      msg: 'something bad happened while getting the snippet languages',
    });
};

module.exports = { readAll };
