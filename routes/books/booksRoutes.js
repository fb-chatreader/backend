const router = require('express').Router();
const Books = require('../../models/db/books');
const Categories = require('../../models/db/categories');

router.post('/add', async (req, res) => {
  const books = req.body; //rec content
  for (let i = 0; i < books.length; i++) {
    const publish_date = Date.now();
    const created_at = Date.now();
    const { summary, category, ...book } = books[i];
    book.publish_date = publish_date;
    book.created_at = created_at;

    await Books.write(book);
    // categories[category]
    const { category } = categories.retrieve({ [category]: 1 }).first();
    await Categories.write(category);
  }
});

module.exports = router;
