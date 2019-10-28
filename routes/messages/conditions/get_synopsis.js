module.exports = async Event => {
  if (await Event.isUserMessage()) {
    Event.setOverride('get_started');
  }
};
