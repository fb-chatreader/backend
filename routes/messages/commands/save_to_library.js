const UserLibrary = require('models/db/userLibraries.js');

module.exports = async event => {
  const { user_id, book_id } = event;

  const currentLibrary = await UserLibrary.retrieve({ user_id });

  if (!currentLibrary.find(book => book.book_id === book_id)) {
    await UserLibrary.add({ user_id, book_id });
  }

  return [
    {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: 'What do you want to do next?',
          buttons: [
            {
              title: 'View Library',
              type: 'postback',
              payload: JSON.stringify({
                command: 'view_library'
              })
            },
            {
              title: 'Read Summary',
              type: 'postback',
              payload: JSON.stringify({
                command: 'get_summary',
                book_id
              })
            }
          ]
        }
      }
    }
  ];
};
