const UserCategories = require('models/db/userCategories.js');
const { getNewCategoriesForUser } = require('../helpers/categories.js');
// const Categories = require('models/db/categories.js');
const QuickReplyTemplate = require('../UI/QuickReplyTemplate.js');

module.exports = async (event) => {
  const { user_id, category_id } = event;
  console.log('category_id');
  console.log(category_id);

  let userCategories = await UserCategories.retrieve({ user_id });
  const categories = await getNewCategoriesForUser(user_id);
  console.log('categories.length');
  console.log(categories.length);
  const isAdding = categories.length === 0 ? false : true;

  /**
   * Filter out non-userCats from total cats
   * Filtered out results assigned to variable
   * iterate results
   */
  console.log('isAdding');
  console.log(isAdding);

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
  if (!isAdding) {
    return 'Done';
  }
  // if (event.command !== 'pick_category' && userCategories.length >= 3) {
  //   return 'Done';
  // }

  // Currently categories are not tied to a page_id so we'd have to loop over their books or just add
  // a page_id to categories

  const text = !userCategories.length
    ? 'Tell us your top three favorite genres so we know what to suggest!  To get started pick your favorite!'
    : userCategories.length === 1 ? 'One more to go!' : 'Great, now pick a second!';

  const quickReplies = await QuickReplyTemplate(categories, event, userCategories);
  console.log('quickReplies');
  console.log(quickReplies);

  return [
    {
      text,
      quick_replies: quickReplies
    }
  ];
};
