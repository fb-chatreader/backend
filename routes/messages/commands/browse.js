module.exports = async function(Event) {
  const { user_id } = Event;
  const [Categories, UserCategories] = this.withDBs(
    'categories',
    'userCategories'
  );

  const userCategories = await UserCategories.retrieve({ user_id });

  const categories = await Promise.all(
    userCategories.map(
      async ({ category_id: id }) => await Categories.retrieve({ id }).first()
    )
  );

  const replies = categories.map(({ id: category_id, name: title }) => ({
    title,
    payload: JSON.stringify({
      command: 'get_books_from_category',
      category_id
    })
  }));

  replies.push({
    title: 'Other categories',
    payload: JSON.stringify({
      command: 'get_other_categories',
      user_id
    })
  });

  replies.push({
    title: 'Curated Books',
    payload: JSON.stringify({
      command: 'get_curated_books',
      user_id
    })
  });

  const text = 'Which category would you like to browse?';
  return this.sendTemplate('QuickReply', text, replies);
};
