const Categories = require('models/db/categories');
const getBooksInCategories = require('../helpers/getBooksInCategories.js');

module.exports = async function(Event) {
  const { category_id, user_id } = Event;
  const category = await Categories.retrieve({ id: category_id }).first();

  const { isEndOfCategory, books } = await getBooksInCategories(
    user_id,
    category_id
  );

  const text = `Would you like to see more books on ${category.name}?`;
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

  return [
    this.sendTemplate('Book', Event, books),
    isEndOfCategory
      ? this.redirectTo(Event, 'browse')
      : this.sendTemplate('QuickReply', text, quickReplies)
  ];
};
