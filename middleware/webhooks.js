const Users = require('models/db/users.js');
const Pages = require('models/db/pages.js');
const Books = require('models/db/books.js');

module.exports = { validateWebhook, getPageData, parseWebhook };

function validateWebhook({ body }, res, next) {
  if (body.object === 'page' && body.entry && body.entry[0]) {
    next();
  }
}

async function getPageData({ body: { entry } }, res, next) {
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
  if (isPolicyViolation(entry)) {
    entry[0].event = parsePolicyViolation(entry);
    next();
  } else if (isValidUserAction(entry)) {
    entry[0].event = await parseUserAction(entry);
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
  // The 'event' is what triggered the webhook and we store
  // its data under a variable with the same name
  const event = entry[0].messaging[0];

  // Get user if they exists already in our database
  let user = await Users.retrieve({ facebook_id: event.sender.id }).first();

  if (!user) {
    // Save sender ID in DB if they're a new user
    user = await Users.add({ facebook_id: event.sender.id });
  }

  // So many commands currently rely on how many books are available
  // for the page, we've added the bookCount as a default
  const books = await Books.retrieve({ 'b.page_id': entry[0].page.id });

  // Default data based to every command
  let parsed_data = {
    sender: event.sender.id,
    user,
    user_id: user.id,
    page: entry[0].page,
    bookCount: books.length
  };

  if (event.postback || (event.message && event.message.quick_reply)) {
    // There are 3 conditions that can fire this block:
    // 1) User clicked a postback button
    // 2) User clicked a quick reply button
    // 3) User followed a referral link and has never used the bot before

    // Postbacks and quick replies are handled in exactly the same way, the payload
    // is just in a different location in the object.
    const payload = event.postback
      ? event.postback.payload
      : event.message.quick_reply.payload;

    const isReferral = event.postback && event.postback.referral;

    parsed_data = isReferral
      ? {
          ...parsed_data,
          ...handleReferral(event.postback.referral.ref),
          type: 'referral'
        }
      : {
          ...parsed_data,
          ...JSON.parse(payload),
          type: 'postback'
        };
  } else if (event.referral) {
    // This block will fire under one condition:
    // 1) User clicked a referral link and has used the bot before

    // Sample referral link:
    // http://m.me/109461977131004?ref=command=start_book,book_id=1

    parsed_data = {
      ...parsed_data,
      ...handleReferral(entry[0].messaging[0].referral.ref),
      type: 'referral'
    };
  } else if (event && event.message) {
    // Fires whenever the user types something at the bot
    parsed_data = {
      ...parsed_data,
      command: event.message.text
        .toLowerCase()
        .split(' ')
        .join('_'),
      type: 'message'
    };
  }
  return parsed_data;
}

function isValidUserAction(entry) {
  return entry && entry[0] && entry[0].messaging;
}

function isPolicyViolation(entry) {
  return entry[0] && entry[0]['policy-enforcement'];
}

function handleReferral(qs) {
  const refData = queryStringToObject(qs);

  refData.command = refData.command ? refData.command : 'start_book';
  delete refData.command;

  return refData;
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
