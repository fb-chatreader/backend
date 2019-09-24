const UserCategories = require('models/db/userCategories.js');
const Categories = require('models/db/categories.js');
const pick_category = require('./pick_category.js');
const request_email = require('./request_email.js');
const QuickReplyTemplate = require('../UI/QuickReplyTemplate.js');

module.exports = async event => {
  const { user_id } = event;

  const userCategories = await UserCategories.retrieve({ user_id });
  if (userCategories.length < 3) {
    const category = await pick_category(event);
    if (category !== 'Done') {
      return category;
    }
  }

  if (!event.user.email) {
    return request_email(event);
  }

  const text = 'Which of your genres would you like to browse?';

  const categories = await Promise.all(
    userCategories.map(
      async ({ category_id: id }) => await Categories.retrieve({ id }).first()
    )
  );
  const replies = categories.map(({ id: category_id, name: title }) => ({
    title,
    payload: JSON.stringify({
      command: 'get_books_from_category',
      category_id
    })
  }));

  return [QuickReplyTemplate(text, replies)];
};
