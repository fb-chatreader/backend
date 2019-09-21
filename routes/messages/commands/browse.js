const UserCategories = require('models/db/userCategories.js');
const pick_category = require('./pick_category.js');
const request_email = require('./request_email.js');
const getBooksInCategories = require('../helpers/getBooksInCategories.js');
const BookTemplate = require('../UI/BookTemplate.js');

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

  const text = 'Based on your preferences, here are some books you might like!';

  return [
    { text },
    await BookTemplate(event, await getBooksInCategories(user_id))
  ];
};
