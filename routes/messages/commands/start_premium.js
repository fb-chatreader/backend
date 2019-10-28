const SubscribeTemplate = require('../Templates/Subscribe.js');

module.exports = async event => {
  const { user_id } = event;

  return [SubscribeTemplate({ user_id })];
};
