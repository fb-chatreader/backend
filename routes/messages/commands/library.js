module.exports = async Event => {
  const { user_id, page_id } = Event;
  const [UserLibrary] = this.withDBs('userLibraries');

  const userLibrary = await UserLibrary.retrieve({ user_id, page_id });

  return !userLibrary.length
    ? {
        text: "You don't have a library yet!"
      }
    : this.sendTemplate(
        'Generic',
        userLibrary.map(b => {
          const buttons = [];
          if (b.synopsis) {
            buttons.push({
              type: 'postback',
              title: 'Read Synopsis',
              payload: JSON.stringify({
                command: 'get_synopsis',
                book_id: b.id
              })
            });
          }
          buttons.push(
            {
              type: 'postback',
              title: 'Start Summary',
              payload: JSON.stringify({
                command: 'get_summary',
                book_id: b.id
              })
            },
            {
              type: 'postback',
              title: 'Remove from Library',
              payload: JSON.stringify({
                command: 'toggle_in_library',
                book_id: b.id,
                isAdding: false
              })
            }
          );

          return {
            title: b.title,
            image_url: b.image_url,
            subtitle: `by ${b.author}`,
            buttons
          };
        })
      );
};
