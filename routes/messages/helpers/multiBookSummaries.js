const Users = require('models/db/users.js');
const SubscribeTemplate = require('../UI/SubscribeTemplate.js');

module.exports = async event => {
  const { user_id, book_id, user } = event;

  const { stripe_subscription_status, credits } = user;
  const isSubscribed = stripe_subscription_status === 'active';

  const chatRead = await ChatReads.retrieve({ user_id, book_id }).first();

  if (!chatRead) {
    // Before proceeding with a new book, verify the user is subscribed or has a credit
    if (!isSubscribed && !credits) {
      return [SubscribeTemplate({ ...event, command: 'start_book' })];
    }

    if (!isSubscribed) {
      // If the account is not subscribed, decrement credits
      await Users.edit({ id: user_id }, { credits: user.credits - 1 });
    }
  }
};
