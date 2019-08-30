const router = require('express').Router();
const Books = require('../../models/db/books');
const Categories = require('../../models/db/categories');
const Book_Categories = require('../../models/db/bookCategories');
const Summary_Parts = require('../../models/db/summaryParts');

router.post('/add', async (req, res) => {
  const books = req.body; //rec content
  for (let i = 0; i < books.length; i++) {
    const publish_date = new Date();
    const created_at = new Date();
    const { summary, category, ...book } = books[i];
    book.publish_date = publish_date;
    book.created_at = created_at;

    const newBook = await Books.write(book);
    // categories[category]
    // cat id
    const { id } = Categories.retrieve({ [category]: 1 }).first();
    await Categories.write(id);
    
    const bookCategory = { book_id: newBook.id, category_id: id };
    await Book_Categories.write(bookCategory);

    const summaryArray = getSummaryParts(summary)
    for (let i = 0; i < summaryArray.length; i++) {
       const summaryObj = {book_id: newBook.id, summary: summaryArray[i], created_at: new Date()}; 
       await Summary_Parts.write(summaryObj);
    }
  }
});


function getSummaryParts(summary) {
    const extraSpace = summary
      .replace(/[.]/gi, '. ')
      .replace(/[!]/gi, '! ')
      .replace(/[?]/gi, '? ');
  
    const limit = 320;
    let parts = [];
    let current = '';
    let sentences = extraSpace.split('  ');
  
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      if ((current + ' ' + sentence).length <= limit) {
        current += ' ' + sentence;
      } else {
        parts.push(current);
        current = '';
      }
    }
    if (current.length) {
      parts.push(current);
      current = '';
    }
    return parts;
  }

module.exports = router;
