const QRT = require('../Templates/QuickReply.js');

// Part of onboarding, requires the user to specify if they want long or short summaries.

// The value is saved in the users table under "prefersLongSummaries" inside of the "browse" command
module.exports = () => {
  return [
    QRT('Would you like to read 2-minute or 10-15 minute summaries?', [
      {
        title: '2-minute',
        payload: JSON.stringify({
          command: 'browse',
          prefersLongSummaries: false
        })
      },
      {
        title: '10-minute',
        payload: JSON.stringify({
          command: 'browse',
          prefersLongSummaries: true
        })
      }
    ])
  ];
};
