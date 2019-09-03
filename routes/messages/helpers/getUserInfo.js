const axios = require('axios');

module.exports = async PSID => {
  const url = `https://graph.facebook.com/${PSID}?fields=first_name&access_token=${process.env.PAGE_ACCESS_TOKEN}`;
  try {
    const request = await axios.get(url);
    return request.data;
  } catch (err) {
    if (process.env.DB_ENVIRONMENT !== 'testing') console.log(err);
  }
};
