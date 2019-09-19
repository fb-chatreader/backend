const UserCategories = require('models/db/userCategories.js');
const { getNewCategoriesForUser } = require('../helpers/categories.js');
const QuickReplyTemplate = require('../UI/QuickReplyTemplate.js');

module.exports = async (event) => {
  const { user_id, category_id, command } = event;

  const text = null;
  const userCategories = await UserCategories.retrieve({ user_id });
  const categories = await getNewCategoriesForUser(user_id);
  const isAdding = categories.length === 0 ? false : true;

  if (isAdding) {
    const newCategory =
      category_id && !userCategories.find((c) => c.category_id === category_id)
        ? await UserCategories.add({ user_id, category_id })
        : null;
    newCategory ? userCategories.push(newCategory) : null;
  }

  // if (isAdding === false) {
  //   const removedCategory =
  //     category_id && userCategories.find((c) => c.category_id === category_id)
  //       ? await UserCategories.remove({ user_id, category_id })
  //       : null;
  //   userCategories = removedCategory ? userCategories.filter((c) => c.category_id !== category_id) : userCategories;
  // }

  // If the user was sent here by another command, send them back as soon as they have
  // enough categories;
  if (!isAdding || categories >= 3) {
    return 'Done';
  }

  // Currently categories are not tied to a page_id so we'd have to loop over their books or just add
  // a page_id to categories
  if (!userCategories.length) {
    text = 'Tell us your top three favorite genres so we know what to suggest!  To get started pick your favorite!';
  } else if (userCategories.length === 2) {
    text = 'Great, now pick a second!';
  } else if (userCategories.length === 1) {
    text = 'One more to go!';
  } else {
    console.log('Still hanging on what to do here.');
  }

  const quickReplies = await QuickReplyTemplate(categories, event, userCategories);

  return [
    {
      text,
      quick_replies: quickReplies
    }
  ];
};
