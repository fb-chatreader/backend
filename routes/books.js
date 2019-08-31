const router = require('express').Router();
const Books = require('../models/db/books.js');

router.route('/').post((req, res) => {
  const books = req.body;

  books.forEach(b => {
    const { title, author, summary, category } = b;
    const newBook = { title, author, category };
  });
});
