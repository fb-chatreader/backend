module.exports = async (categories, event, userCategories) => {
  await userCategories;
  const { command } = event;
  const remainingCategories = categories.map((c) => {
    let title = c.name;

    return {
      content_type: 'text',
      title,
      payload: JSON.stringify({
        command: command,
        looped_from: command,
        category_id: c.id,
      })
    };
  });
  return remainingCategories;
};
