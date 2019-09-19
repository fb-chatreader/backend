const UserCategories = require('models/db/userCategories.js');

module.exports = async (event) => {
  const { user_id } = event;
  const userCategories = await UserCategories.retrieve({ user_id });
  userCategories.forEach((c) => {
    // console.log(c);
    UserCategories.remove({ user_id, category_id: c.category_id });
  });
  // console.log(userCategories);
};
