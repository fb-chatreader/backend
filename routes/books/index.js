const router = require('express').Router();

const saveBook = require('./helpers/saveBook.js');
const getSummaryParts = require('./helpers/getSummaryParts.js');

router.post('/add', async (req, res) => {
  const books = req.body;

  if (Array.isArray(books)) {
    // If endpoint receives an array of books
    for (let i = 0; i < books.length; i++) {
      await saveBook(books[i]);
      return res.sendStatus(201);
    }
  } else {
    // if Endpoint receives a single book object
    await saveBook(books);
    return res.sendStatus(201);
  }
});

module.exports = router;
