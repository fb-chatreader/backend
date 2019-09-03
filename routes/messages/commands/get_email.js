const Users = require('../../../models/db/users.js');
const getUserInfo = require('../helpers/getUserInfo.js');

module.exports = async event => {
  // Currently just saves an email when presented with one.
  // Future work:
  // Return a series (3) of carousels based on the user's preferred categories, if they exist.
  const user = await Users.retrieveOrCreate({ facebook_id: event.sender.id });
  await Users.edit(user.id, (email = event.validEmail));
  const user_info = await getUserInfo(event.sender.id);

  return [
    {
      text: `${user_info.first_name}, thank you for entering your email!`
    }
  ];
};
