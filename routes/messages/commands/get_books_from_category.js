const Categories = require('models/db/categories');
const getBooksInCategories = require('../helpers/getBooksInCategories.js');
const BookTemplate = require('../Templates/Book.js');
const QuickReplyTemplate = require('../Templates/QuickReply.js');
const browse = require('./browse.js');

module.exports = async event => {
  const { category_id, user_id } = event;
  const currentCat = await Categories.retrieve({ id: category_id });

  const { isEndOfCategory, books } = await getBooksInCategories(
    user_id,
    category_id
  );

  const text = `Would you like to see more books on ${currentCat[0].name}?`;
  const quickReplies = [];
  const options = [
    {
      title: 'More',
      command: 'get_books_from_category',
      category_id
    },
    {
      title: 'Other',
      command: 'browse'
    }
  ];

  options.forEach(opt => {
    const { title, command, category_id } = opt;

    quickReplies.push({
      title,
      payload: JSON.stringify({
        command: command.toLowerCase(),
        category_id
      })
    });
  });
  const browseQR = await browse(event);
  return isEndOfCategory
    ? [await BookTemplate(event, books), ...browseQR]
    : [
        await BookTemplate(event, books),
        await QuickReplyTemplate(text, quickReplies)
      ];
};
