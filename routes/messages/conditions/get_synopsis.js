module.exports = async function(Event) {
  console.log('Synopsis Override');
  Event.overrideOnUserMessage('get_started');

  if (!Event.book_id) {
    Event.setOverride('get_started');
  }
};
