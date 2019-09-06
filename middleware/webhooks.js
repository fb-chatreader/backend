const Users = require('models/db/users.js');
const Client = require('models/db/clients.js');

const verifyWebhook = ({ body }, res, next) => {
  if (body.object === 'page') {
    next();
  }
};
// a global array of categoreis
const categories = ['money', 'others', 'entrepreneurship', 'leadership'];

const formatWebhook = async ({ body: { entry }, params }, res, next) => {
  // We receive data for our commands from a variety of places.
  // This middleware is meant to organize that data into a single place to
  // simplify the rest of our code
  const { client_id } = params;
  const client = await Client.retrieve({ id: client_id }).first();
  if (!client) return res.sendStatus(404);

  entry.client_id = client_id;
  entry.access_token = client.access_token;
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
    entry[0].input = await formatEventObject(entry, event);
    next();
  } else {
    return res.sendStatus(400);
  }
};

module.exports = { verifyWebhook, formatWebhook };

async function formatEventObject(entry, event) {
  // Order of importance for webhooks --> Policy violations > Postback > Commands
  // Type added in case we need to verify source (do we want users to say "policy violation"
  // and trigger our policy violation command?)
  console.log('RECEIVING USER: ', event.sender.id);
  const user = await Users.retrieve({ facebook_id: event.sender.id }).first();

  if (event && event.message && isValidEmail(event.message.text)) {
    await Users.edit({ id: user.id }, { email: event.message.text });
    event.postback = {
      payload: JSON.stringify({
        command: 'pick_category',
        email: event.message.text,
        client_id: entry.client_id
      })
    };
  }

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
      sender: event.sender,
      user_id: user.id,
      client_id: entry.client_id,
      access_token: entry.access_token
    };
  } else if (event && event.message) {
    parsed_data = {
      command: event.message.text
        .toLowerCase()
        .split(' ')
        .join('_'),
      type: 'input',
      sender: event.sender,
      user_id: user.id,
      client_id: entry.client_id,
      access_token: entry.access_token
    };
  }
  return parsed_data;
}

function isValidMessengerRequest(entry, event) {
  return event || (entry && entry[0]);
}

function isValidEmail(email) {
  // Test for email format.  Tests in order:
  // one @, dot after @
  // first character is a number or letter
  // last character is a letter
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    /[a-z0-9]/.test(email[0]) &&
    /[a-z]/.test(email[email.length - 1])
  );
}
