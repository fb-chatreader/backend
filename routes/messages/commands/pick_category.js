const UserCategories = require('models/db/userCategories.js');
const { getNewCategoriesForUser } = require('../helpers/categories.js');
const request_email = require('./request_email.js');
const QuickReply = require('../UI/QuickReplyTemplate.js');

module.exports = async (event) => {
  const { user_id, category_id, isAdded } = event;

  let userCategories = await UserCategories.retrieve({ user_id });

  if (isAdded) {
    const newCategory =
      category_id && !userCategories.find((c) => c.category_id === category_id)
        ? await UserCategories.add({ user_id, category_id })
        : null;
    newCategory ? userCategories.push(newCategory) : null;
  }

  if (isAdded === false) {
    const removedCategory =
      category_id && userCategories.find((c) => c.category_id === category_id)
        ? await UserCategories.remove({ user_id, category_id })
        : null;
    userCategories = removedCategory ? userCategories.filter((c) => c.category_id !== category_id) : userCategories;
  }

  if (event.command === 'pick_category' && userCategories.length >= 3) {
    // If the user was sent here by another command, send them back as soon as they have
    // enough categories;
    return request_email(event);
  }

  // Currently categories are not tied to a page_id so we'd have to loop over their books or just add
  // a page_id to categories
  const categories = await getNewCategoriesForUser(user_id);

  const buttons = categories.map((c) => {
    let title = c.name;
    let params = {
      content_type: 'text',
      title,
      command: 'pick_category',
      category_id: c.id,
      isAdded: null
    };
    return QuickReply(params, event);
  });

  const text = !userCategories.length
    ? 'Tell us your top three favorite genres so we know what to suggest!  To get started pick your favorite!'
    : userCategories.length === 1 ? 'Great, now pick a second!' : 'One more to go!';
  return [
    {
      text,
      quick_replies: buttons
    }
  ];
};
