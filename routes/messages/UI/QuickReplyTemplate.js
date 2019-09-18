module.exports = async (categories, event) => {
  const remainingCategories = categories.map((c) => {
    const isAdded = userCategories.find((uc) => uc.category_id === c.id);
    let title = userCategories.length ? (isAdded ? `- ${c.name}` : `+ ${c.name}`) : c.name;
    // console.log(categories);

    return {
      content_type: 'text',
      title,
      payload: JSON.stringify({
        command: event.command,
        looped_from: 'pick_category',
        category_id: c.id,
        isAdding: isAdded
      })
    };
  });
  // console.log('remainingCategories');
  // console.log('remainingCategories');
  // console.log('remainingCategories');
  // console.log(remainingCategories);

  return remainingCategories;
};
