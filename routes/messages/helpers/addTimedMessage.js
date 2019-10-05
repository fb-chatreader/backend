const TimedMessages = require('models/db/timedMessages.js');

module.exports = async (user_id, page_id) => {
  // To better catch a user at the start of their free time,
  // only update timed messages if one doesn't already exists
  const timedMessage = await TimedMessages.retrieve({
    user_id,
    page_id
  }).first();

  if (!timedMessage) {
    await TimedMessages.add({
      user_id,
      page_id
    });
  }
};
