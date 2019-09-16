const Users = require('models/db/users.js');
const Books = require('models/db/books.js');
const browse = require('./browse.js');
module.exports = async event => {
  // When the user types a valid email address, save it to their account.
  // Then redirect them to 'browse'
  const { user_id: id, bookCount } = event;
  event.user = await Users.edit({ id }, { email: event.original_message });
  return bookCount > 1 ? browse(event) : null;
};
