const UserCategories = require('models/db/userCategories.js');
const Categories = require('models/db/categories.js');
const QuickReplyTemplate = require('../Templates/QuickReply.js');

module.exports = async event => {
  const { user_id } = event;

  const userCategories = await UserCategories.retrieve({ user_id });
  const userCategoryIDs = userCategories.map(cat => {
    return cat.category_id;
  });

  const allCategories = await Categories.retrieve();

  const otherCategories = [];

  allCategories.forEach(cat => {
    if (!userCategoryIDs.includes(cat.id)) {
      otherCategories.push(cat);
    }
  });

  const text = 'Here are some other categories';

  const replies = otherCategories.map(({ id: category_id, name: title }) => ({
    title,
    payload: JSON.stringify({
      command: 'get_books_from_category',
      category_id
    })
  }));

  return [QuickReplyTemplate(text, replies)];
};
