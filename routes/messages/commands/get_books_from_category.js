const getBooksInCategories = require('../helpers/getBooksInCategories.js');
const BookTemplate = require('../UI/BookTemplate.js');
const QuickReplyTemplate = require('../UI/QuickReplyTemplate.js');
const browse = require('./browse.js');

module.exports = async (event) => {
  const { category_id, user_id } = event;
  const { isEndOfCategory, books } = await getBooksInCategories(user_id, category_id);

  // const options = [
  //   {
  const title = 'Yes, show me more';
  const command = 'get_books_from_category';
  //   }
  // ];

  const options = [
    {
      title: 'Yes, show me more',
      command: 'get_books_from_category'
    },
    {
      title: 'Browse other categories',
      command: 'browse'
    }
  ];

  const text = 'Would you like to see more books from this genre?';

  const quickReplies = [];

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
