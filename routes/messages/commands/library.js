module.exports = async function(Event) {
  const { user_id, page_id } = Event;
  const [UserLibrary] = this.withDBs('userLibraries');

  const userLibrary = await UserLibrary.retrieve({ user_id, page_id });

  return !userLibrary.length
    ? {
        text: "You don't have a library yet!"
      }
    : this.sendTemplate('Book', Event, userLibrary);
};
