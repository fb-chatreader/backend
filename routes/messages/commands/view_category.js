const UserCategories = require('models/db/userCategories.js');
const { getNewCategoriesForUser } = require('../helpers/categories.js');
const request_email = require('./request_email.js');
const pick_category = require('./pick_category.js');
const QuickReplyRemove = require('../UI/QuickReplyRemove.js');

module.exports = async (event) => {
  const { user_id, category_id, isRemoved } = event;

  let userCategories = await UserCategories.retrieve({ user_id });

  if (isRemoved === false) {
    const removedCategory =
      category_id && userCategories.find((c) => c.category_id === category_id)
        ? await UserCategories.remove({ user_id, category_id })
        : null;
    userCategories = removedCategory ? userCategories.filter((c) => c.category_id === category_id) : userCategories;
  }

  if (event.command === 'view_category' && userCategories.length <= 0) {
    // If the user was sent here by another command, send them back as soon as they have
    // enough categories;
    return pick_category(event);
  }

  // Currently categories are not tied to a page_id so we'd have to loop over their books or just add
  // a page_id to categories
  // userCategories = await UserCategories.retrieve({ user_id });
  // userCategories = await UserCategories.retrieve({ user_id });
  // console.log(userCategories);

  const buttons = userCategories.map((c) => {
    console.log(c);

    let title = c.name;
    let params = {
      content_type: 'text',
      title,
      command: 'view_category',
      category_id: c.category_id,
      isRemoved: null
    };
    return QuickReplyRemove(params, event);
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
