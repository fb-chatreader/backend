module.exports = async function(Event) {
  if (this.hasOpenState(Event)) {
    this.setState(Event);
  }
  Event.overrideIfNotOnboarded();
};
