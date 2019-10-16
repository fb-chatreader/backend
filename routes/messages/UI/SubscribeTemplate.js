const GenericTemplate = require('./GenericTemplate.js');
const hashUserID = require('../helpers/hashUserID.js');

module.exports = user_id => {
  // Must supply a user_id so a token can be generated
  const url = `${process.env.FRONTEND_URL}/chooseplan/${hashUserID({
    user_id
  })}`;
  return GenericTemplate([
    {
      title: 'Subscribe to Chatwise',
      subtitle: 'and start reading unlimited book summaries!',
      image_url: 'https://i.imgur.com/UdZlgQA.png',
      default_action: {
        type: 'web_url',
        url
      },
      buttons: [
        {
          type: 'web_url',
          url,
          title: 'Subscribe'
        }
      ]
    }
  ]);
};
