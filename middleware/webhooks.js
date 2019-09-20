const Users = require('models/db/users.js');
const Pages = require('models/db/pages.js');
const Books = require('models/db/books.js');

module.exports = { validateWebhook, getPageData, parseWebhook };

function validateWebhook({ body }, res, next) {
  if (body.object === 'page') {
    next();
  }
}

async function getPageData({ body: { entry }, params }, res, next) {
  // Page ID tells us which page the webhook was sent from (and thus what books it has access to)
  const { id } = entry[0];
  const page = await Pages.retrieve({ id }).first();
  if (!page) return res.sendStatus(404);
  entry[0].page = page;
  next();
}

async function parseWebhook({ body: { entry } }, res, next) {
  // We receive data for our commands from a variety of places.
  // This middleware is meant to organize that data into a single place to
  // simplify the rest of our code

  if (isValidMessengerRequest(entry)) {
    entry[0].event = isPolicyViolation(entry)
      ? parsePolicyViolation(entry)
      : await parseUserAction(entry);

    next();
  } else {
    return res.sendStatus(400);
  }
}

function parsePolicyViolation(entry) {
  return {
    command: 'policy_violation',
    type: 'policy_violation',
    ...entry[0]['policy-enforcement'],
    page_id: entry[0].id
  };
}

async function parseUserAction(entry) {
  // Order of importance for webhooks --> Postback > Referrals > Commands
  // Type added in case we need to verify source (do we want users to say "policy violation"
  // and trigger our policy violation command?)

  // The 'event' exists for postbacks and user messages
  // It's essentially where the data for those webhooks exists
  const event =
    entry && entry[0] && entry[0].messaging ? entry[0].messaging[0] : null;

  // Get user if they exists already in our database
  let user = event
    ? await Users.retrieve({ facebook_id: event.sender.id }).first()
    : null;

  if (event && !user) {
    // Save sender ID in DB if they're a new user
    user = await Users.add({ facebook_id: event.sender.id });
  }

  const books = await Books.retrieve({ page_id: entry[0].page.id });

  let parsed_data = {
    sender: event.sender.id,
    user,
    user_id: user.id,
    page: entry[0].page,
    bookCount: books.length
  };
  if (event.postback || (event.message && event.message.quick_reply)) {
    const payload = event.postback
      ? event.postback.payload
      : event.message.quick_reply.payload;
    parsed_data = {
      ...parsed_data,
      ...JSON.parse(payload),
      type: 'postback'
    };
    if (
      event.postback &&
      event.postback.referral &&
      event.postback.referral.ref
    ) {
      console.log('REFERENCE RECEIVED: ', event.postback.referral.ref);
    }
  } else if (event.referral) {
    parsed_data = {
      ...parsed_data,
      ...queryStringToObject(event.referral.ref),
      type: 'referral'
    };
  } else if (event && event.message) {
    parsed_data = {
      ...parsed_data,
      command: event.message.text
        .toLowerCase()
        .split(' ')
        .join('_'),
      original_message: event.message.text,
      type: 'message'
    };
  }
  return parsed_data;
}

function isValidMessengerRequest(entry) {
  const event =
    entry && entry[0] && entry[0].messaging ? entry[0].messaging[0] : null;
  return event || (entry && entry[0]);
}

function isPolicyViolation(entry) {
  return !!entry[0]['policy-enforcement'];
}

function queryStringToObject(query) {
  const obj = {};
  const vars = query.split(',');
  vars.forEach(v => {
    const pair = v.split('=');
    obj[pair[0]] = pair[1];
  });
  return obj;
}
