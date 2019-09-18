module.exports = async (categories, event, userCategories) => {
  await userCategories;
  const remainingCategories = categories.map((c) => {
    const isAdded = userCategories.find((uc) => uc.category_id === c.id);
    let title = userCategories.length ? (isAdded ? `${c.name}` : `${c.name}`) : c.name;
    // console.log('event.command');
    // console.log(c);

    return {
      content_type: 'text',
      title,
      payload: JSON.stringify({
        command: event.command,
        looped_from: 'pick_category',
        category_id: c.id,
      })
    };
  });
  return remainingCategories;
};
