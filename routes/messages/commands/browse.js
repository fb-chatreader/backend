const UserCategories = require('models/db/userCategories.js');
const Categories = require('models/db/categories.js');
const Users = require('models/db/categories.js');

const QRT = require('../UI/QuickReplyTemplate.js');

const pick_category = require('./pick_category.js');
const request_email = require('./request_email.js');
const request_summary_preference = require('./request_summary_preference.js');

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

  if (event.hasOwnProperty('prefersLongSummaries')) {
    // event.prefersLongSummaries will exist on the postback return from request_summary_preference
    const { prefersLongSummaries } = event;
    const updatedUser = await Users.edit(
      { id: user_id },
      { prefersLongSummaries }
    );
    event.user = updatedUser;
  } else if (event.user.prefersLongSummaries === null) {
    return request_summary_preference(event);
  }

  const text = 'Which category would you like to browse?';

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

  replies.push({
    title: 'Other categories',
    payload: JSON.stringify({
      command: 'get_other_categories',
      user_id
    })
  });

  return [QRT(text, replies)];
};
