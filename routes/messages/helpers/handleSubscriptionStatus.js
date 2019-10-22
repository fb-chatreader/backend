const Users = require('models/db/users.js');

module.exports = ({ user }) => {
  const { stripe_subscription_status, credits, id } = user;

  let canRead = stripe_subscription_status === 'active';

  // Only use tokens if the user is NOT subscribed
  if (!canRead && credits) {
    canRead = true;
    // If the account is not subscribed, decrement credits
    Users.edit({ id }, { credits: user.credits - 1 }).then(x => x);
  }
  return canRead;
};
