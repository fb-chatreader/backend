const UserCategories = require('models/db/userCategories.js');

module.exports = async function(Event) {
  const { user_id } = Event;

  const userCategories = await UserCategories.retrieve({ user_id });

  // Only show categories the user has not saved
  const categories = await Event.getNewCategoriesForUser();

  const quick_replies = categories.map(c => {
    return {
      title: c.name,
      payload: JSON.stringify({
        command: 'save_category',
        category_id: c.id,
        redirect: Event.validatedCommand
      })
    };
  });

  const intro =
    Event.validatedCommand === 'browse' ? 'To get started, please ' : 'Please ';

  const text = !userCategories.length
    ? intro + 'select 3 categories'
    : userCategories.length === 1
    ? '2 more to go...'
    : 'Last one!';

  return this.sendTemplate('QuickReply', text, quick_replies);
};
