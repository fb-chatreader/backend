const UserCategories = require('models/db/userCategories.js');
const { getNewCategoriesForUser } = require('../helpers/categories.js');
const QRT = require('../Templates/QuickReply.js');

module.exports = async Event => {
  const { user_id, page_id } = Event;

  const userCategories = await UserCategories.retrieve({ user_id });

  // Currently categories are not tied to a page_id so we'd have to loop over their books or just add
  // a page_id to categories
  const categories = await getNewCategoriesForUser(user_id, page_id);

  const quick_replies = categories.map(c => {
    let title = c.name;
    return {
      title,
      payload: JSON.stringify({
        command: 'save_category',
        category_id: c.id,
        redirect: Event.command
      })
    };
  });

  const intro =
    Event.command === 'browse' ? 'To get started, please ' : 'Please ';

  const text = !userCategories.length
    ? intro + 'select 3 categories'
    : userCategories.length === 1
    ? '2 more to go...'
    : 'Last one!';

  return QRT(text, quick_replies);
};
