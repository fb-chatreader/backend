const Books = require('models/db/books');
const Categories = require('models/db/categories');
const Book_Categories = require('models/db/bookCategories');
const Summary_Parts = require('models/db/summaryParts');

module.exports = async bookObj => {
  const { summary, category, ...book } = bookObj;
  if (!summary || !category || !book.title || !book.author || !book.cover_img) {
    // If we're missing any part of a book, skip over it
    return;
  }
  const newBook = await Books.write(book);
  const book_category = await Categories.retrieve({
    [category.toLowerCase()]: 1
  }).first();
  await Book_Categories.write({
    book_id: newBook[0].id,
    category_id: book_category.id
  });

  const summaryArray = getSummaryParts(summary);
  for (let i = 0; i < summaryArray.length; i++) {
    const summaryObj = {
      book_id: newBook[0].id,
      summary: summaryArray[i]
    };
    await Summary_Parts.write(summaryObj);
  }
  return;
};
