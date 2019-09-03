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
  console.log("WEBHOOK MIDDLEWARE");
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
      type: 'webhook',
      ...entry[0]['policy-enforcement'],
      page_id: entry[0].recipient.id
    };
  } else if (event && event.postback) {
    parsed_data = {
      ...JSON.parse(event.postback.payload),
      type: 'postback',
      sender: event.sender
    };
    // edge case- user type wrong email
    // v
  } else if (event && event.message) {
    let validEmail = event.message.text
    if (isValidEmail(validEmail)) {
      parsed_data = {
        command:'get_email',
        type: 'input',
        sender: event.sender,
        validEmail: event.message.text
      }
    } else if (event.message.text === 'leadership' || event.message.text === 'entrepreneurship' || event.message.text === 'money' || event.message.text === 'other') {
      let catagories;
      parsed_data = {
        command: 'get_catagories',
        type:'input',
        sender: event.sender,
        catagories: event.message.text
      }
    } else {
      parsed_data = {
        command: event.message.text
          .toLowerCase()
          .split(' ')
          .join('_'),
        type: 'input',
        sender: event.sender
      };
    }
  }
  if (entry && entry[0] && parsed_data) {
    entry[0].input = parsed_data;
    next();
  } else {
    return res.sendStatus(400);
  }
};

module.exports = { verifyWebhook, formatWebhook };
