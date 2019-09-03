const Users = require('models/db/users.js');

const verifyWebhook = ({ body }, res, next) => {
  if (body.object === 'page') {
    next();
  }
};

const formatWebhook = async ({ body: { entry } }, res, next) => {
  // We receive data for our commands from a variety of places.
  // This middleware is meant to organize that data into a single place to
  // simplify the rest of our code

  const event =
    entry && entry[0] && entry[0].messaging ? entry[0].messaging[0] : null;
  if (event) {
    // Save sender ID in DB if it doesn't already exist
    const exists = await Users.retrieve({
      facebook_id: event.sender.id
    }).first();
    if (!exists) {
      await Users.add({ facebook_id: event.sender.id });
    }
  }

  if (isValidMessengerRequest(entry, event)) {
    entry[0].input = formatEventObject(entry, event);
    next();
  } else {
    return res.sendStatus(400);
  }
};

module.exports = { verifyWebhook, formatWebhook };

function formatEventObject(entry, event) {
  // Order of importance for webhooks --> Policy violations > Postback > Commands
  // Type added in case we need to verify source (do we want users to say "policy violation"
  // and trigger our policy violation command?)
  let parsed_data;
  if (entry[0]['policy-enforcement']) {
    parsed_data = {
      command: 'policy_violation',
      type: 'policy_violation',
      ...entry[0]['policy-enforcement'],
      page_id: entry[0].recipient.id
    };
  } else if (event.postback) {
    parsed_data = {
      ...JSON.parse(event.postback.payload),
      type: 'postback',
      sender: event.sender
    };
  } else if (event && event.message) {
    parsed_data = {
      command: event.message.text
        .toLowerCase()
        .split(' ')
        .join('_'),
      type: 'input',
      sender: event.sender
    };
  }
  return parsed_data;
}

function isValidMessengerRequest(entry, event) {
  return event || (entry && entry[0]);
}
