const Users = require('models/db/users.js');

module.exports = async function(Event) {
  const { user, user_id } = Event;
  if (Event.setting === 'summaryLength') {
    const changes = await Users.edit(
      { id: user_id },
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
      payload: JSON.stringify({ command: 'reset_categories' })
    }
  ];
  const text = 'Which of your settings would you like to change?';
  return this.sendTemplate('QuickReply', text, quick_replies);
};
