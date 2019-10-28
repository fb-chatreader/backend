const UserLibraries = require('models/db/userLibraries.js');
const GenericTemplate = require('./GenericTemplate.js');

module.exports = async (event, books) => {
  // await books;
  const { user_id, bookCount, user } = event;
  const { prefersLongSummaries } = user;

  let command = 'get_summary';
  if (event.summaryLength) {
    // There are multiple conditions to consider when loading a long or short summary.
    // To give the code the option to override the user's settings, the event object
    // is checked for a summaryLength first.  Then, if one wasn't provided, go with the user's settings.
    // If all else fails, default to long summaries.
    command =
      event.summaryLength === 'long' ? 'get_summary' : 'get_short_summary';
  } else if (user.hasOwnProperty('prefersLongSummaries')) {
    command = prefersLongSummaries ? 'get_summary' : 'get_short_summary';
  }

  books = Array.isArray(books) ? books : [books];
  return [
    GenericTemplate(
      await Promise.all(
        books.slice(0, 10).map(async b => {
          const { id: book_id, title, image_url } = b;
          const buttons = [
            {
              type: 'postback',
              title: 'Start Summary',
              payload: JSON.stringify({
                command,
                book_id
              })
            }
          ];

          if (bookCount > 1) {
            const usersLibrary = await UserLibraries.retrieve({ user_id });
            const isInLibrary = usersLibrary.find(
              lib => lib.id === parseInt(book_id, 10)
            );

            buttons.push({
              type: 'postback',
              title: isInLibrary ? 'Remove from Library' : 'Add to Library',
              payload: JSON.stringify({
                command: 'toggle_in_library',
                book_id,
                isAdding: !isInLibrary
              })
            });
          }

          buttons.push({
            type: 'web_url',
            title: 'Share',
            url: `${process.env.FRONTEND_URL}/summary/${book_id}`
          });

          return {
            title,
            image_url,
            subtitle: `by ${b.author}`,
            buttons
          };
        })
      )
    )
  ];
};
