module.exports = async Event => {
  const { user_id, page_id, category_id, isAdding } = Event;
  const { getNewCategoriesForUser } = this.helpers;

  let userCategories = await UserCategories.retrieve({ user_id });

  if (isAdding) {
    const newCategory =
      category_id && !userCategories.find(c => c.category_id === category_id)
        ? await UserCategories.add({ user_id, category_id })
        : null;
    newCategory ? userCategories.push(newCategory) : null;
  }

  if (isAdding === false) {
    const removedCategory =
      category_id && userCategories.find(c => c.category_id === category_id)
        ? await UserCategories.remove({ user_id, category_id })
        : null;
    userCategories = removedCategory
      ? userCategories.filter(c => c.category_id !== category_id)
      : userCategories;
  }

  const categories = await getNewCategoriesForUser(user_id, page_id);

  const quick_replies = categories.map(c => {
    let title = c.name;
    return {
      title,
      payload: JSON.stringify({
        command: 'browse',
        category_id: c.id,
        isAdding: true
      })
    };
  });

  const text = !userCategories.length
    ? 'To get started, please select 3 categories'
    : userCategories.length === 1
    ? '2 more to go...'
    : 'Last one!';

  return [QuickReply(text, quick_replies)];
};
