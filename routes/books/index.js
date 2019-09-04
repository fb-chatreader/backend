const router = require('express').Router();

const saveBook = require('./helpers/saveBook.js');
const Client = require('models/db/clients.js');

router.post('/add/:client_id', async (req, res) => {
  console.log('Receiving books');

  const { client_id } = req.params;

  const client = Client.retrieve({ id: client_id }).first();

  if (!client) return res.status(404).json({ message: 'No client by that ID' });

  const books = req.body;
  if (Array.isArray(books)) {
    // If endpoint receives an array of books
    for (let i = 0; i < books.length; i++) {
      const save = await saveBook(books[i], client_id);
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
    const save = await saveBook(books, client_id);
    return save
      ? res.sendStatus(201)
      : res.status(400).json({
          message:
            'Books must include a summary, category, title, author, and cover image'
        });
  }
});

module.exports = router;
