module.exports = async function(Event) {
  Event.overrideOnUserMessage();

  Event.overrideOnMissingProperty('prefersLongSummaries');
};
