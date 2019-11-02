module.exports = async function(Event) {
  Event.overrideOnUserMessage('get_started');
  Event.overrideOnMissingProperty('book_id', 'get_started');
};
