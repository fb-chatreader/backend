module.exports = async function(Event) {
    Event.overrideOnUserMessage('get_started');
  
    if (!Event.book_id) {
      Event.setOverride('get_started');
    }
};