const UserLibrary = require('models/db/userLibraries.js');

module.exports = async event => {
  const { user_id, book_id } = event;

  const currentLibrary = await UserLibrary.retrieve({ user_id });

  if (!currentLibrary.find(book => book.book_id === book_id)) {
    await UserLibrary.add({ user_id, book_id });
  }

  return null;
};
