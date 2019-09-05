const Users = require('../../../models/db/users.js');
const UserCategories = require('../../../models/db/usersCategories.js');
const getUserInfo = require('../util/asyncFunctions.js');
const Categories = require('../../../models/db/categories.js');


module.exports = async event => {
  // get user id
  const user = await Users.retrieveOrCreate({ facebook_id: event.sender.id });
  
  // write to the catagory table with values users passed. if money, in the categories table
  // set money = 1. At this point the table is empty.
  let catPick = event.catagories;

  const category = await Categories.write({[catPick]: 1});
  // the categories table is updated with what the user passes, money, leadership...
  
  // get the category id so that it can be passed to the userCategories table.
  const cat = await Categories.retrieve({[catPick]: 1}).first();

  const user_info = await getUserInfo(event.sender.id);
//   console.log(event.catagories, 'event');

  const userSelection = await UserCategories.write({category_id: cat.id, user_id: user.id});
  
  return [
      {
          text: `${
        user_info.first_name
      },thank you for selecting category.`
    }
  ]
}