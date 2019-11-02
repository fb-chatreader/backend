module.exports = async function(Event) {
  if (Event.isPostback()) {
    this.setState(Event);
  }
  const isOnboarding = Event.overrideIfNotOnboarded();

  if (!isOnboarding) {
    // Clear state if we don't onboard
    this.clearState(Event);
  }
};
