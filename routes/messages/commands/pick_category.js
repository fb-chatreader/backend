const UserCategories = require('models/db/userCategories.js');
// const Categories = require('models/db/categories.js');
const { getNewCategoriesForUser } = require('../helpers/categories.js');

module.exports = async (event) => {
  const { user_id, category_id, isAdding } = event;

  let userCategories = await UserCategories.retrieve({ user_id });

  if (isAdding) {
    const newCategory =
      category_id && !userCategories.find((c) => c.category_id === category_id)
        ? await UserCategories.add({ user_id, category_id })
        : null;
    newCategory ? userCategories.push(newCategory) : null;
  }

  if (isAdding === false) {
    const removedCategory =
      category_id && userCategories.find((c) => c.category_id === category_id)
        ? await UserCategories.remove({ user_id, category_id })
        : null;
    userCategories = removedCategory ? userCategories.filter((c) => c.category_id !== category_id) : userCategories;
  }

  if (event.command !== 'pick_category' && userCategories.length >= 3) {
    // If the user was sent here by another command, send them back as soon as they have
    // enough categories;
    return 'Done';
  }

  // if (event.looped_from === 'pick_category') return;

  // Currently categories are not tied to a page_id so we'd have to loop over their books or just add
  // a page_id to categories
  const categories = await getNewCategoriesForUser(user_id);
  const buttons = categories.map((c) => {
    // const isAdded = userCategories.find(uc => uc.category_id === c.id);
    // let title = userCategories.length
    //   ? isAdded
    //     ? `- ${c.name}`
    //     : `+ ${c.name}`
    //   : c.name;
    const title = c.name;
    return {
      content_type: 'text',
      title,
      payload: JSON.stringify({
        command: event.command,
        looped_from: 'pick_category',
        category_id: c.id,
        isAdding: true
      })
    };
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
