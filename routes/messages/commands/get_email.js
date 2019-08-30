const Users = require('../../../models/db/users.js');
const getUserInfo = require('../util/asycFunctions.js');

module.exports = async event => {
    /**
     * collects email from users and stores in in the user table
     * return response edge case, invalid email
     * good email => save
     * 3 carasoal include the options they selected
     *  get started => welcome => pick category 
     * => email address => save email => 3 carasol
     * => reading
     * 
     * edge case:
     * check user category and return the valid category
     * 
     * bad email 
     */
  const user = await Users.retrieveOrCreate({facebook_id: event.sender.id });
  const userEmail = await Users.edit(user.id, email = event.validEmail);
  const user_info = await getUserInfo(event.sender.id);

  return [
      {
        text: `${
            user_info.first_name
        }, thank you for entering your email!`
      }
  ]
}