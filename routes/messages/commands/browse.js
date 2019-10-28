const Categories = require('models/db/categories.js');

const QRT = require('../Templates/QuickReply.js');

module.exports = async event => {
  const { user_id } = event;

  const text = 'Which category would you like to browse?';

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

  return [QRT(text, replies)];
};
