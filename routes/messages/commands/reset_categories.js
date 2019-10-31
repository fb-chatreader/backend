const UserCategories = require('models/db/userCategories.js');

module.exports = async function(Event) {
  const { user_id } = Event;

  await UserCategories.remove({ user_id });

  this.redirectTo(Event, 'browse');
};
