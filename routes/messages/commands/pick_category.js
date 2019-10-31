const UserCategories = require('models/db/userCategories.js');
const QRT = require('../Templates/QuickReply.js');

module.exports = async Event => {
  const { user_id } = Event;

  const userCategories = await UserCategories.retrieve({ user_id });

  // Only show categories the user has not saved
  const categories = await Event.getNewCategoriesForUser();

  // If command given is this command, push them toward browse as a default behavior
  console.log('VAL: ', Event.validatedCommand);
  const redirect =
    Event.validatedCommand === 'pick_category'
      ? 'browse'
      : Event.validatedCommand;

  const quick_replies = categories.map(c => {
    return {
      title: c.name,
      payload: JSON.stringify({
        command: 'save_category',
        category_id: c.id,
        redirect
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
