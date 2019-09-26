const Categories = require('../../../models/db/categories');
const BookCategories = require('../../../models/db/bookCategories');

module.exports = async (event) => {
  let category_id = null;
  const { category_name } = event;
  const categories = await Categories.retrieve();

  category_id = await findCategoryId(categories, category_name);
  const catBooks = await BookCategories.retrieve({ category_id });

  return sortRatingQty(catBooks);
};

function findCategoryId(cats, name) {
  let id = null;
  cats.forEach((cat) => {
    if (cat.name === name) {
      id = cat.id;
    }
  });
  return id;
}

function sortRatingQty(books) {
  return books.sort((a, b) => {
    return b.rating_qty - a.rating_qty;
  });
}
