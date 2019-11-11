module.exports = async function(Event) {
  const { user_id, category_id } = Event;
  console.log('EVENT: ', event);
  const [UserCategories] = this.withDBs('userCategories');
  console.log('DB: ', UserCategories);
  const userCategories = await UserCategories.retrieve({ user_id });
  console.log('USER CATEGORIES: ', userCategories);
  if (!userCategories.find(c => c.category_id === category_id)) {
    console.log('ADDING CATEGORY: ', category_id);
    await UserCategories.add({ user_id, category_id });
    console.log('SAVED');
  }
  console.log('ROUTING TO: ', Event.redirect);
  this.redirectTo(Event, Event.redirect);
};
