// Part of onboarding, requires the user to specify if they want long or short summaries.
// The value is saved in the users table under "prefersLongSummaries" inside of the "browse" command

module.exports = async function(Event) {
  // If Event was previously saved to onboard, restore the Event
  if (this.isUsingState(Event)) {
    Event = this.getState(Event);
  }
  const text = 'Would you like to read 2-minute or 10-15 minute summaries?';
  const buttons = [
    {
      title: '2-minute',
      payload: JSON.stringify({
        command: Event.validatedCommand,
        prefersLongSummaries: false
      })
    },
    {
      title: '10-minute',
      payload: JSON.stringify({
        command: Event.validatedCommand,
        prefersLongSummaries: true
      })
    }
  ];

  return this.sendTemplate('QuickReply', text, buttons);
};
