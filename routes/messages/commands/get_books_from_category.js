const getBooksInCategories = require('../helpers/getBooksInCategories.js');
const BookTemplate = require('../UI/BookTemplate.js');
const QuickReplyTemplate = require('../UI/QuickReplyTemplate.js');

module.exports = async event => {
  const { category_id, user_id } = event;

  const options = [
    {
      title: 'Yes, show me more',
      command: 'get_books_from_category'
    }
  ];

  let text = 'Would you like to see more books from this category?';

  const quickReplies = [];

  options.forEach((o, i) => {
    const { title, command } = o;

    quickReplies.push({
      title,
      payload: JSON.stringify({ command: command.toLowerCase() })
    });
  });

  return [
    await BookTemplate(
      event,
      await getBooksInCategories(user_id, [category_id])
    ),
    await QuickReplyTemplate(text, quickReplies)
  ];
};
