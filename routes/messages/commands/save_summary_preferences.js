module.exports = async function(Event) {
  // User has submitted their preference for short or long summaries
  const { prefersLongSummaries } = Event;
  const [Users] = this.withDBs('users');
  if (this.hasState(Event)) {
    this.getState(Event);
  }
  const updatedUser = await Users.edit(
    { id: Event.user_id },
    { prefersLongSummaries }
  );
  Event.setUser(updatedUser);
  console.log('REDIRECT TO: ', Event.validatedCommand);
  this.redirectTo(Event, Event.validatedCommand);
};
