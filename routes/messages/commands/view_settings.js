const Users = require('models/db/users.js');

// const QRT = require('../UI/QuickReplyTemplate.js');

module.exports = async Event => {
  const { user } = Event;
  if (Event.setting === 'summaryLength') {
    const changes = await Users.edit(
      { id: user.id },
      { prefersLongSummaries: !user.prefersLongSummaries }
    );
    return [
      {
        text: `Summary length set to: ${
          changes.prefersLongSummaries ? '10 minute' : '2 minute'
        }`
      }
    ];
  }
  const quick_replies = [
    {
      title: `${user.prefersLongSummaries ? '2' : '10'} Minute Summaries`,
      payload: JSON.stringify({
        command: 'view_settings',
        setting: 'summaryLength'
      })
    },
    {
      title: 'Reset Categories',
      payload: JSON.stringify({ command: 'reset_categories', reset: true })
    }
  ];
  const text = 'Which of your settings would you like to change?';
  return [QRT(text, quick_replies)];
};
