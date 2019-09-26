const Books = require('../../../models/db/books');
const Categories = require('../../../models/db/categories');
const BookCategories = require('../../../models/db/bookCategories');

/**
 * CONSIDERATIONS:
 * - sort as new books are added to allBooks?
 * - sort
 */

module.exports = async (event) => {
  console.log('event');
  console.log('event');
  console.log('event');
  let category_id = null;
  const { category_name } = event;
  // console.log(category_name);

  const books = await Books.retrieve();
  console.log('books');
  console.log('books');
  console.log('books');
  console.log('books');
  console.log(books);

  const categories = await Categories.retrieve();

  /**
   * get category_id of category_name
   */

  categories.forEach((cat) => {
    if (cat.name === category_name) {
      category_id = cat.id;
    }
  });
  const catBooks = await BookCategories.retrieve({ category_id });
  console.log('catBooks');
  console.log('catBooks');
  console.log('catBooks');
  // console.log(catBooks);

  const filteredBooks = await BookCategories.retrieve();

  // const sortedBooks = books.map((book, i) => {
  //   // console.log(category_id);
  //   if (book.id === category_id) {
  //     return book;
  //   }
  // });

  // console.log(sortedBooks);

  /**
   * - @PARAMS category, array of books
   * - filter out category from allBooks
   * - sort filtered books by quantity
   * - then, sort filtered books by avg_rating
   * - 
   */
};
