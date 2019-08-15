const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router().use(bodyParser.json());
const db = require('../models/dbConfig');
const dbBooks = require('../models/db/books');

router.get('/', async (req, res) => {
  try {
    const books = await dbBooks.retrieve();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: 'failed to retrieve books'
    });
  }
});

module.exports = router;
