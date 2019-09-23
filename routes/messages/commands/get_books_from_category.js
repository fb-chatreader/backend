const getBooksInCategories = require('../helpers/getBooksInCategories.js');
const BookTemplate = require('../UI/BookTemplate.js');

module.exports = async event => {
  const { category_id, user_id } = event;

  return [
    await BookTemplate(
      event,
      await getBooksInCategories(user_id, [category_id])
    )
  ];
};
