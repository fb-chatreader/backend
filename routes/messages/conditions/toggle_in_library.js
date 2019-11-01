module.exports = async Event => {
  Event.overrideOnUserMessage();
  await Event.overrideIfNotOnboarded();
};
