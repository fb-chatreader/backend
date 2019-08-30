const router = require('express').Router();
const Categories = require('../../models/db/categories');
// const Book_Categories = require('../../models/db/bookCategories');

// need to insert categories into the db and assign the id of 1 to each category
router.post('/add', async (req, res) => {
  //   const categories = req.body;
  const categories = [
    { leadership: 1 },
    { entrepreneurship: 1 },
    { money: 1 },
    { other: 1 }
  ];
  for (let i = 0; categories.length; i++) {
    const category = categories[i];
    Categories.write(category);
  }
  return res.sendStatus(200);
});
module.exports = router;
