const Users = require('models/db/users.js');

module.exports = async function(Event) {
  // When the user types a valid email address, save it to their account.
  // Then redirect them to 'browse'
  const { user_id: id } = Event;
  const email = Event.command;

  const wasPreviousCommand = this.isUsingState(Event);
  if (wasPreviousCommand) {
    // Override Event to previous state, if it exists
    this.getState(Event);
  }
  Event.user = await Users.edit({ id }, { email });

  const nextCommand = wasPreviousCommand ? Event.validatedCommand : 'browse';
  console.log('nextCommand: ', nextCommand);
  Event.isMultiBookPage()
    ? this.redirectTo(Event, nextCommand)
    : this.redirectTo(Event, 'get_started');
};
