const axios = require('axios');
// Given a PSID and access token, Messenger can retrieve the user's public information
module.exports = async Event => {
  const { sender_id, access_token } = Event;
  const url = `https://graph.facebook.com/${sender_id}?fields=first_name&access_token=${access_token}`;
  try {
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    if (process.env.DB_ENVIRONMENT !== 'testing') console.log(err);
  }
};
