const UserCategories = require('models/db/userCategories.js');

const QRT = require('../UI/QuickReplyTemplate.js');

const pick_category = require('./pick_category.js');

module.exports = async event => {
  const { reset, user_id } = event;

  if (reset) {
    await UserCategories.remove({ user_id });
  }
  const category = await pick_category(event);
  if (category !== 'Done') {
    return category;
  }

  return [
    QRT('Categories updated!', [
      {
        title: 'Browse Books',
        payload: JSON.stringify({
          command: 'browse'
        })
      }
    ])
  ];
};
