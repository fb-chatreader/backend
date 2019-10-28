// const UserCategories = require('models/db/userCategories.js');
// const { getNewCategoriesForUser } = require('../helpers/categories.js');

module.exports = async Event => {
  const {
    user_id,
    category_id,
    isAdding,
    page: { id: page_id }
  } = Event;

  const userCategories = await UserCategories.retrieve({ user_id });

  if (isAdding) {
    const newCategory =
      category_id && !userCategories.find(c => c.category_id === category_id)
        ? await UserCategories.add({ user_id, category_id })
        : null;
    newCategory ? userCategories.push(newCategory) : null;
  }

  if (userCategories.length >= 3) {
    // If the user was sent here by another command, let that command know they have enough categories by returning 'Done'
    return 'Done';
  }

  // Currently categories are not tied to a page_id so we'd have to loop over their books or just add
  // a page_id to categories
  const categories = await getNewCategoriesForUser(user_id, page_id);

  const quick_replies = categories.map(c => {
    let title = c.name;
    return {
      title,
      payload: JSON.stringify({
        command: Event.command,
        category_id: c.id,
        isAdding: true
      })
    };
  });

  const firstMessage = Event.command === 'browse' ? 'To get started, p' : 'P';

  const text = !userCategories.length
    ? firstMessage + 'lease select 3 categories'
    : userCategories.length === 1
    ? '2 more to go...'
    : 'Last one!';

  return [QRT(text, quick_replies)];
};
