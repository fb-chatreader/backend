module.exports = (tokens => ({ event, token }) => {
  // If status exists, it'll record what the user was doing at the time they were
  // prompted to subscribe.  IF they choose to continue with the subscription,
  // they'll be able to continue.  Should mimic the payload for a postback

  if (token) {
    // Give a token and get a user_id back
    // Token expires after use or server reset
    const retrieved = tokens[token];
    return retrieved;
  }
  // Supply a user_id and get a token back
  const str = `${event.user_id}${process.env.APP_SECRET}${new Date()}`;
  token = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    token = (token << 5) - token + char;
    token = token & token; // Convert to 32bit integer
  }

  tokens[token] = event;

  return token;
})({});
