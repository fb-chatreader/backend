const Books = require('../../../models/db/books');
const Categories = require('../../../models/db/categories');
const BookCategories = require('../../../models/db/bookCategories');
const getBooksFromCategory = require('../../../routes/messages/commands/get_books_from_category');
/**
 * CONSIDERATIONS:
 * - sort as new books are added to allBooks?
 * - sort
 */

module.exports = async (event) => {
  let category_id = null;
  const { category_name } = event;
  const categories = await Categories.retrieve();

  categories.forEach((cat) => {
    if (cat.name === category_name) {
      category_id = cat.id;
    }
  });

  const catBooks = await BookCategories.retrieve({ category_id });
  console.log(sortRatingQty(catBooks));
};

function sortRatingQty(books) {
  return books.sort((a, b) => {
    return b.rating_qty - a.rating_qty;
  });
}
