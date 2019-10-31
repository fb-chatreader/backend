const Users = require('models/db/users.js');

module.exports = async function(Event) {
  // When the user types a valid email address, save it to their account.
  // Then redirect them to 'browse'
  const { user_id: id } = Event;
  Event.user = await Users.edit({ id }, { email: Event.command });
  Event.isMultiBookPage()
    ? this.redirectTo(Event, 'browse')
    : this.redirectTo(Event, 'get_started');
};
