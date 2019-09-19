const UserCategories = require('models/db/userCategories.js');
const { getNewCategoriesForUser } = require('../helpers/categories.js');
const QuickReplyTemplate = require('../UI/QuickReplyTemplate.js');

module.exports = async (event) => {
  const { user_id, category_id, command } = event;

  let text = null;
  let userCategories = await UserCategories.retrieve({ user_id });
  let categories = await getNewCategoriesForUser(user_id);
  let userCatLength = await getUserCatLength(userCategories);
  console.log('userCategories >>>> before');
  console.log(userCategories);
  const isAdding = categories.length === 0 ? false : true;
  const isAddingParams = {
    isAdding,
    user_id,
    category_id,
    userCategories,
    UserCategories
  };

  handleIsAdding(isAddingParams);

  // If the user was sent here by another command, send them back as soon as they have
  // enough categories;
  if (!isAdding || categories >= 3) {
    return 'Done';
  }

  // Currently categories are not tied to a page_id so we'd have to loop over their books or just add
  // a page_id to categories
  console.log('userCategories.length <<<<<<< before');
  console.log('userCategories.length <<<<<<< before');
  console.log('userCategories.length <<<<<<< before');
  console.log('userCategories.length <<<<<<< before');
  console.log(userCatLength);
  if (userCatLength === 0) {
    text = 'Tell us your top three favorite genres so we know what to suggest!  To get started pick your favorite!';
  } else if (userCatLength === 1) {
    text = 'Great, now pick a second!';
  } else if (userCatLength === 2) {
    text = 'One more to go!';
  } else if (userCatLength === 3) {
    console.log('Still hanging on what to do here.');
    text = 'Great!  That is enough to get started.';
  }

  categories = await getNewCategoriesForUser(user_id);
  const quickReplies = await QuickReplyTemplate(categories, event, userCategories);

  userCategories = await UserCategories.retrieve({ user_id });
  console.log('userCategories >>>> after');
  console.log(userCategories);
  userCatLength = await getUserCatLength(userCategories);
  console.log('userCategories.length >>> after');
  console.log('userCategories.length >>> after');
  console.log('userCategories.length >>> after');
  console.log('userCategories.length >>> after');
  console.log(userCatLength);
  return [
    {
      text,
      quick_replies: quickReplies
    }
  ];
};

function handleIsAdding(params) {
  const { isAdding, user_id, category_id, userCategories, UserCategories } = params;
  if (isAdding) {
    return addCategory(user_id, category_id, userCategories, UserCategories);
  }
  if (!isAdding) {
    removeCategory(user_id, category_id, userCategories, UserCategories);
  }
}

async function addCategory(user_id, category_id, userCategories, UserCategories) {
  console.log('addCat');
  const newCategory =
    category_id && !userCategories.find((c) => c.category_id === category_id)
      ? await UserCategories.add({ user_id, category_id })
      : null;
  newCategory ? userCategories.push(newCategory) : null;
}

async function removeCategory(user_id, category_id, userCategories, UserCategories) {
  console.log('removeCat');
  const removedCategory =
    category_id && userCategories.find((c) => c.category_id === category_id)
      ? await UserCategories.remove({ user_id, category_id })
      : null;
  userCategories = removedCategory ? userCategories.filter((c) => c.category_id !== category_id) : userCategories;
}
function getUserCatLength(usercats) {
  return usercats.length;
}
