const router = require('express').Router();
const Categories = require('../../models/db/categories');
// const Book_Categories = require('../../models/db/bookCategories');

// need to insert categories into the db and assign the id of 1 to each category
router.post('/add', async (req, res) => {
  console.log("hitting endpoint set for category")
  //   const categories = req.body;
  const categories = [
    { leadership: 1 },
    { entrepreneurship: 1 },
    { money: 1 },
    { other: 1 }
  ];
  console.log("hitting endpoint set for category", categories)
  for (let i = 0; i < categories.length; i++) {
    console.log("hitting endpoint set for category", categories[i])
    const category = categories[i];
    const testCat = await Categories.write(category);
    console.log("hitting endpoint set for category", testCat)
  }
  console.log("end of the endpoint");
  return res.sendStatus(200);
});
module.exports = router;
