module.exports = async Event => {
  if (Event.isSingleBookPage()) {
    Event.setOverride('get_started');
  }
};
