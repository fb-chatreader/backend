const Users = require('models/db/users.js');
/* DEVELOPMENT COMMAND -- THIS MUST BE DELETED BEFORE GOING LIVE!!!! */
module.exports = async event => {
  const { user_id } = event;
  await Users.remove(user_id);

  return [{ text: 'Your account has been reset' }];
};
