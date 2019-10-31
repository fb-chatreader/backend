module.exports = async function(Event) {
  const { user_id, category_id } = Event;
  const [UserCategories] = this.withDBs('userCategories');

  const userCategories = await UserCategories.retrieve({ user_id });

  if (!userCategories.find(c => c.category_id === category_id)) {
    await UserCategories.add({ user_id, category_id });
  }

  this.redirectTo(Event, Event.redirect);
};
