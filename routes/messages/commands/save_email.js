const Users = require('models/db/users.js');
const Books = require('models/db/books.js');
const browse = require('./browse.js');
module.exports = async Event => {
  // When the user types a valid email address, save it to their account.
  // Then redirect them to 'browse'
  const { user_id: id, bookCount } = Event;
  Event.user = await Users.edit({ id }, { email: Event.original_message });
  return bookCount > 1 ? browse(Event) : null;
};
