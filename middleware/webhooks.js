const verifyWebhook = ({ body }, res, next) => {
  if (body.object === 'page') {
    next();
  }
};

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

const formatWebhook = ({ body: { entry } }, res, next) => {
  // We receive data for our commands from a variety of places.
  // This middleware is meant to organize that data into a single place to
  // simplify the rest of our code
  let command;
  const event =
    entry && entry[0] && entry[0].messaging ? entry[0].messaging[0] : null;

  // Order of importance for webhooks --> Policy violations > Postback > Commands
  // Type added in case we need to verify source (do we want users to say "policy violation"
  // and trigger our policy violation command?)
  if (entry && entry[0] && entry[0]['policy-enforcement']) {
    command = {
      command: 'policy_violation',
      type: 'webhook',
      ...entry[0]['policy-enforcement'],
      page_id: entry[0].recipient.id
    };
  } else if (event && event.postback) {
    command = {
      command: event.postback.payload.toLowerCase(),
      type: 'postback',
      sender: event.sender
    };
    // edge case- user type wrong email
    // v
  } else if (event && event.message) {
  const validEmail = event.message.text;
  if(isValidEmail(validEmail)) {
    command = {
      command: `get_email`,
      type: 'input',
      sender: event.sender,
      validEmail: validEmail,
    };
  } else {
    command = {
      command: event.message.text
        .toLowerCase()
        .split(' ')
        .join('_'),
      type: 'input',
      sender: event.sender
    };
  }
  // if validemail.isValid then command getValid email will be executed
  // get started or whatever command the user types
  }

  if (entry && entry[0] && command) {
    entry[0].input = command;
    next();
  } else {
    res.sendStatus(400);
  }
};

module.exports = { verifyWebhook, formatWebhook };
