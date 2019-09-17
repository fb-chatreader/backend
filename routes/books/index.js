const router = require('express').Router();

const saveBook = require('./helpers/saveBook.js');
const Pages = require('models/db/pages.js');
const Books = require('models/db/books.js');

router.get('/', async (req, res) => {
  const books = await Books.retrieve({ page_id: process.env.PAGE_ID });

  return res.status(200).json(books);
});

router.post('/add/:page_id', async (req, res) => {
  console.log('Receiving books');

  const { page_id } = req.params;

  const page = Pages.retrieve({ id: page_id }).first();

  if (!page) return res.status(404).json({ message: 'No page by that ID' });

  const books = req.body;
  if (Array.isArray(books)) {
    // If endpoint receives an array of books
    for (let i = 0; i < books.length; i++) {
      const save = await saveBook(books[i], page_id);
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
    const save = await saveBook(books, page_id);
    return save
      ? res.sendStatus(201)
      : res.status(400).json({
          message:
            'Books must include a summary, category, title, author, and cover image'
        });
  }
});

module.exports = router;
