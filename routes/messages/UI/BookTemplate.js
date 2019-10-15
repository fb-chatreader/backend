const UserLibraries = require('models/db/userLibraries.js');

module.exports = async (event, books) => {
  await books;
  books = Array.isArray(books) ? books : [books];
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: await Promise.all(
          books.slice(0, 10).map(async b => {
            const { id: book_id, title, image_url, synopsis } = b;
            const buttons = [];
            // if (synopsis) {
            //   buttons.push({
            //     type: 'postback',
            //     title: 'Read Synopsis',
            //     payload: JSON.stringify({
            //       command: 'get_synopsis',
            //       book_id
            //     })
            //   });
            // }
            buttons.push({
              type: 'postback',
              title: 'Start Summary',
              payload: JSON.stringify({
                command: 'get_summary',
                book_id
              })
            });
            if (event.bookCount > 1) {
              const usersLibrary = await UserLibraries.retrieve({
                user_id: event.user_id
              });
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
              url: 'https://chatreader.netlify.com'
            });
            return {
              title,
              image_url,
              subtitle: `by ${b.author}`,
              buttons
            };
          })
        )
      }
    }
  };
};
