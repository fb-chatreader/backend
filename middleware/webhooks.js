const verifyWebhook = ({ body }, res, next) => {
  if (body.object === 'page') {
    next();
  }
};

const formatWebhook = ({ body: { entry } }, res, next) => {
  // We receive data for our commands from a variety of places.
  // This middleware is meant to organize that data into a single place to
  // simplify the rest of our code
  let parsed_data;
  const event =
    entry && entry[0] && entry[0].messaging ? entry[0].messaging[0] : null;

  // Order of importance for webhooks --> Policy violations > Postback > Commands
  // Type added in case we need to verify source (do we want users to say "policy violation"
  // and trigger our policy violation command?)
  if (entry && entry[0] && entry[0]['policy-enforcement']) {
    parsed_data = {
      command: 'policy_violation',
      type: 'policy_violation',
      ...entry[0]['policy-enforcement'],
      page_id: entry[0].recipient.id
    };
  } else if (event && event.postback) {
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
  if (entry && entry[0] && parsed_data) {
    entry[0].input = parsed_data;
    next();
  } else {
    return res.sendStatus(400);
  }
};

module.exports = { verifyWebhook, formatWebhook };
