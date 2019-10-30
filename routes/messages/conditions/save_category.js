module.exports = ({ category_id }) => {
  if (!category_id) {
    Event.setOverride('get_started');
  }
};
