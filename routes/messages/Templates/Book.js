const UserLibraries = require('models/db/userLibraries.js');
const GenericTemplate = require('./Generic.js');

module.exports = async (Event, books) => {
  // await books;
  const { user_id, user } = Event;
  const { prefersLongSummaries } = user;

  let command = 'get_summary';
  if (Event.summaryLength) {
    // There are multiple conditions to consider when loading a long or short summary.
    // To give the code the option to override the user's settings, the Event object
    // is checked for a summaryLength first.  Then, if one wasn't provided, go with the user's settings.
    // If all else fails, default to long summaries.
    command =
      Event.summaryLength === 'long' ? 'get_summary' : 'get_short_summary';
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

          if (Event.isMultiBookPage()) {
            const usersLibrary = await UserLibraries.retrieve({ user_id });
            const isAdding = !usersLibrary.find(
              lib => lib.id === parseInt(book_id, 10)
            );

            buttons.push({
              type: 'postback',
              title: isAdding ? 'Add to Library' : 'Remove from Library',
              payload: JSON.stringify({
                command: 'toggle_in_library',
                book_id,
                isAdding
              })
            });
          }

          buttons.push({
            type: 'web_url',
            title: 'Share',
            url: `${process.env.FRONTEND_URL}/singlebook/${book_id}`
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
