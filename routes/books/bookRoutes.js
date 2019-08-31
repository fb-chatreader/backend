const router = require('express').Router();
const Books = require('../../models/db/books');
const Categories = require('../../models/db/categories');
const Book_Categories = require('../../models/db/bookCategories');
const Summary_Parts = require('../../models/db/summaryParts');

router.post('/add', async (req, res) => {
  console.log('hitting the api');
  const books = req.body; //rec content
  for (let i = 0; i < books.length; i++) {
    console.log('in for loop');
    const publish_date = new Date();
    const created_at = new Date();
    const { summary, category, ...book } = books[i];
    book.publish_date = publish_date;
    book.created_at = created_at;

    console.log('in for category', category.toLowerCase());
    const newBook = await Books.write(book);

    const { id } = await Categories.retrieve({
      [category.toLowerCase()]: 1
    }).first();
    // console.log()
    console.log('id', id);

    await Categories.write(id);
    // console.log("testCat", testCat);
    const bookCategory = { book_id: newBook[0].id, category_id: id };
    await Book_Categories.write(bookCategory);
    // console.log("testCat", bookCatTest);

    const summaryArray = getSummaryParts(summary);
    for (let i = 0; i < summaryArray.length; i++) {
      // console.log("newBook.id", newBook[0].id);
      const summaryObj = {
        book_id: newBook[0].id,
        summary: summaryArray[i],
        created_at: new Date()
      };
      //  console.log("summaryid", summaryArray[i])
      await Summary_Parts.write(summaryObj);
    }
  }
  return res.sendStatus(200);
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
