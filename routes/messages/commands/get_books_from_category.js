const getBooksInCategories = require('../helpers/getBooksInCategories.js');
const BookTemplate = require('../UI/BookTemplate.js');
const QuickReplyTemplate = require('../UI/QuickReplyTemplate.js');

module.exports = async event => {
  const { category_id, user_id } = event;

  const options = [
    {
      command: 'Get books from category',
      description: 'More books',
      title: 'Yes, show me more'
    },
  ];

  let text = 'Would you like to see more books from this category?';

  const quickReplies = [];

  options.forEach((o, i) => {
    const { title, command, description } = o;

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
