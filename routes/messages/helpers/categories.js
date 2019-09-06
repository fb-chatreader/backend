// const Users = require('models/db/users.js');
const Categories = require('models/db/categories.js');
const UserCategories = require('models/db/userCategories.js');

module.exports = { removeNullColumns, getNewCategoriesForUser };

function removeNullColumns(categoriesArray) {
  // Mutates the objects so no need to return
  categoriesArray.forEach(c => {
    for (category in c) {
      if (c[category] === null) {
        delete c[category];
      }
    }
  });
}

async function getNewCategoriesForUser(user_id) {
  const allCategories = await Categories.retrieve();
  removeNullColumns(allCategories);
  const userCategories = await UserCategories.retrieve({ user_id });
  const userCategoryIDs = userCategories.map(c => c.category_id);

  return allCategories.filter(
    c => userCategoryIDs.indexOf(c.id) === -1 && c.other !== 1
  );
}
