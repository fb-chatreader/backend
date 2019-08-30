const router = require('express').Router();
const Books = require('../../models/db/books');

router.post('/add', async (req, res) => {
  const books = req.body; //rec content
  for (let i = 0; i < books.length; i++) {
    const publish_date = Date.now();
    const created_at = Date.now();
    const { summary, category, ...book } = books[i];
    book.publish_date = publish_date;
    book.created_at = created_at;

    await Books.write(book);

    categories
  }
});

module.exports = router;
