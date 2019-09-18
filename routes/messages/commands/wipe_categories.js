const UserCategories = require('models/db/userCategories.js');

module.exports = async (event) => {
  const { user_id } = event;
  const userCategories = await UserCategories.retrieve({ user_id });
  userCategories.forEach((c) => {
    UserCategories.remove({ user_id, c });
  });
};
