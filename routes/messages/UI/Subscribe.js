const GenericTemplate = require('./GenericTemplate.js');
const tokenSwap = require('../helpers/tokenSwap.js');

module.exports = event => {
  // Must supply a user_id so a token can be generated
  let url = `${process.env.FRONTEND_URL}/chooseplan/${tokenSwap({ event })}`;

  return GenericTemplate([
    {
      title: 'Subscribe to Chatwise!',
      subtitle: 'Start reading unlimited book summaries today!',
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
