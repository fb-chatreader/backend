// const Users = require('models/db/users.js');
const Categories = require('models/db/categories.js');
const UserCategories = require('models/db/userCategories.js');

module.exports = { getNewCategoriesForUser };

async function getNewCategoriesForUser(user_id) {
  const allCategories = await Categories.retrieve();
  const userCategories = await UserCategories.retrieve({ user_id });
  const userCategoryIDs = userCategories.map(c => c.category_id);

  return allCategories.filter(c => userCategoryIDs.indexOf(c.id) === -1);
}
