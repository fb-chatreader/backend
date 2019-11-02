module.exports = async function(Event) {
  Event.overrideOnUserMessage();
  if (Event.isPostback()) {
    // If it's not a postback but it's a valid request,
    // it's been redirected.  In that case, we don't want to override state
    this.setState(Event);
  }
  const isOnboarding = await Event.overrideIfNotOnboarded();
  if (!isOnboarding) {
    // If we didn't onboard the user, clear state
    this.clearState(Event);
  }
};
