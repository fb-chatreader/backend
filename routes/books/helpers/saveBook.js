const Books = require('models/db/books.js');
const Categories = require('models/db/categories.js');
const BookCategories = require('models/db/bookCategories.js');
const SummaryParts = require('models/db/summaryParts');
const getSummaryParts = require('./getSummaryParts.js');

module.exports = async (bookObj, page_id) => {
  const { summary, category, ...book } = bookObj;
  book.page_id = page_id;
  if (
    !summary ||
    !category ||
    !book ||
    !book.title ||
    !book.author ||
    !book.image_url
  ) {
    console.log('Missing book data: ', book.title, book.author, book.image_url);
    return false;
  }
  const newBook = await Books.add(book);
  const book_category = await Categories.retrieve({
    [category.toLowerCase()]: 1
  }).first();
  await BookCategories.add({
    book_id: newBook.id,
    category_id: book_category.id
  });

  const summaryArray = getSummaryParts(summary);
  for (let i = 0; i < summaryArray.length; i++) {
    const summaryObj = {
      book_id: newBook.id,
      summary: summaryArray[i]
    };
    await SummaryParts.add(summaryObj);
  }
  return true;
};
