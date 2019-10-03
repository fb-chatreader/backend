const Categories = require('../../../models/db/categories');
const getBooksInCategories = require('../helpers/getBooksInCategories.js');
const BookTemplate = require('../UI/BookTemplate.js');
const QuickReplyTemplate = require('../UI/QuickReplyTemplate.js');
const browse = require('./browse.js');

module.exports = async (event) => {
  const { category_id, user_id } = event;
  const currentCat = await Categories.retrieve({ id: category_id });

  const { isEndOfCategory, books } = await getBooksInCategories(user_id, category_id);

  const text = 'Would you like to see more books from this genre? Or, peruse another genre?';
  const quickReplies = [];
  const options = [
    {
      title: `More from ${currentCat[0].name}`,
      command: 'get_books_from_category'
    },
    {
      title: 'Other categories',
      command: 'browse'
    }
  ];

  options.forEach((opt) => {
    const { title, command } = opt;

    quickReplies.push({
      title,
      payload: JSON.stringify({ command: command.toLowerCase() })
    });
  });
  const browseQR = await browse(event);
  return isEndOfCategory
    ? [ await BookTemplate(event, books), ...browseQR ]
    : [ await BookTemplate(event, books), await QuickReplyTemplate(text, quickReplies) ];
};
