const express = require('express');
const dbBooks = require('../data/booksDB')
const router = express.Router();

router.get("/", async (req, res) => {
  console.log(' I m here <<<<<<<<<<<<')
  try {
    const books = await dbBooks.retrieve();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      messege: 'failed to retrieve books'
    });
  }
});


module.exports = router;