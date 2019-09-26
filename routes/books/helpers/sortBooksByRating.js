const BookCategories = require('../../../models/db/bookCategories');

module.exports = async (event) => {
  const { category_id } = event;
  const catBooks = await BookCategories.retrieve({ category_id });
  const sortedBooks = sortRatingQty(catBooks);
  return sortedBooks;
};

// function findCategoryId(cats, name) {
//   let id = null;
//   cats.forEach((cat) => {
//     if (cat.name === name) {
//       id = cat.id;
//     }
//   });
//   return id;
// }

function sortRatingQty(books) {
  return books.sort((a, b) => {
    return b.rating_qty - a.rating_qty;
  });
}
