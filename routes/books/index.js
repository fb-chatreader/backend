const router = require('express').Router();

const saveBook = require('./helpers/saveBook.js');

router.post('/add', async (req, res) => {
  console.log('Receiving books');
  const books = req.body;
  if (Array.isArray(books)) {
    console.log('Input is array: ', books.length);
    // If endpoint receives an array of books
    for (let i = 0; i < books.length; i++) {
      console.log('Saving (for) Book: ', books[i]);
      const save = await saveBook(books[i]);
      if (!save) {
        return res.status(400).json({
          message:
            'Books must include a summary, category, title, author, and cover image'
        });
      }
    }
    return res.sendStatus(201);
  } else {
    // if Endpoint receives a single book object
    console.log('Saving (single) Book: ', books);
    const save = await saveBook(books);
    return save
      ? res.sendStatus(201)
      : res.status(400).json({
          message:
            'Books must include a summary, category, title, author, and cover image'
        });
  }
});

module.exports = router;
