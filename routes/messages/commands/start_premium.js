const SubscribeTemplate = require('../Templates/Subscribe.js');

module.exports = async Event => {
  const { user_id } = Event;

  return [SubscribeTemplate({ user_id })];
};
