const Categories = require('../model/categories.js');

const readAll = async (req, res) => {
  const categoriesResponse = await Categories.getAllCategories();

  if (categoriesResponse) {
    const categoriesArr = categoriesResponse[0].map(obj => obj.name);
    // console.log(categoriesArr)
    return res.json({ msg: categoriesArr });
  }

  return res
    .status(500)
    .json({
      msg: 'something bad happened while getting the snippet categories',
    });
};

module.exports = { readAll };
