const UserCategories = require('models/db/userCategories.js');
const Categories = require('models/db/categories.js');
// const { getNewCategoriesForUser } = require('../helpers/categories.js');

module.exports = async (event) => {
  const { user_id, category_id, isAdding } = event;
  console.log(event);

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

  if (event.looped_from === 'pick_category') return;

  // Currently categories are not tied to a page_id so we'd have to loop over their books or just add
  // a page_id to categories
  const categories = await Categories.retrieve();
  const text =
    'You can have any number of favorite genres but give us at least your top three so we can make some suggestions!';

  const buttons = categories.map((c) => {
    const isAdded = userCategories.find((uc) => uc.category_id === c.id);
    let title = userCategories.length ? (isAdded ? `Remove ${c.name}` : `Add ${c.name}`) : c.name;
    return {
      content_type: 'text',
      title: title,
      payload: JSON.stringify({
        command: event.command,
        looped_from: 'pick_category',
        category_id: c.id,
        isAdding: !isAdded
      })
    };
  });

  return [
    {
      text: 'Pick category',
      quick_replies: buttons
    }
  ];
};
