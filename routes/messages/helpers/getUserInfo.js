const axios = require('axios');

module.exports = (PSID) => {
  const url = `https://graph.facebook.com/${PSID}?fields=first_name&access_token=${
    process.env.PAGE_ACCESS_TOKEN
  }`;
  const request = await axios.get(url);
  // console.log("firing get info", request);
  return await request.data;
}