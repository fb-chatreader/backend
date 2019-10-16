module.exports = (tokens => ({ user_id, token }) => {
  if (token) {
    // Give a token and get a user_id back
    // Token expires after use or server reset
    const retrieved = tokens[token];
    delete tokens[token];
    return retrieved;
  }
  // Supply a user_id and get a token back
  const str = `${user_id}${process.env.APP_SECRET}${new Date()}`;
  let token = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    token = (token << 5) - token + char;
    token = token & token; // Convert to 32bit integer
  }

  tokens[token] = user_id;
  return token;
})({});
