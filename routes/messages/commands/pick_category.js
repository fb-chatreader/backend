const Users = require('models/db/users.js');
const Books = require('models/db/books.js');
const Categories = require('models/db/categories.js');
const BookCategories = require('models/db/bookCategories.js');
const UserCategories = require('models/db/userCategories.js');

const cleanCategories = require('../helpers/cleanCategories.js');

module.exports = async input => {
  if (input.type !== 'postback') return;
  const { user_id, category_id } = input;

  const userCategoryObjects = await UserCategories.retrieve({ user_id });
  const userCategoryIDs = userCategoryObjects.map(c => c.category_id);

  const newCategory =
    category_id && userCategoryIDs.indexOf(category_id) === -1
      ? await UserCategories.add({ user_id, category_id })
      : null;

  if (newCategory) {
    userCategoryIDs.push(newCategory.category_id);
  }

  if (!userCategoryIDs.length) return;

  return userCategoryIDs.length > 0 && userCategoryIDs.length < 3
    ? getNextFavorite(userCategoryIDs)
    : finishCategories(userCategoryIDs, input);
};

async function getNextFavorite(userCategoryIDs) {
  const allCategories = await Categories.retrieve();
  const remainingCategories = allCategories.filter(
    c => userCategoryIDs.indexOf(c.id) === -1 && c.other !== 1
  );
  cleanCategories(remainingCategories);

  const text =
    userCategoryIDs.length === 1
      ? 'Thanks, now pick a second favorite:'
      : 'Great!  Okay, last one:';

  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text,
        buttons: remainingCategories.map(c => {
          // Everything except the category name must be destructured
          // for this to work
          const { id, image_url, flavor_text, ...category } = c;
          const title = Object.keys(category)[0];

          return {
            type: 'postback',
            title: title[0].toUpperCase() + title.substring(1),
            payload: JSON.stringify({
              command: 'pick_category',
              category_id: id
            })
          };
        })
      }
    }
  };
}

async function finishCategories(userCategoryIDs, { user_id, email }) {
  const user = Users.retrieve({ id: user_id }).first();

  const text =
    user.email || email
      ? 'So based on your preferences, here are some books you might like!'
      : "Thanks, I'm ready to make some book suggestions but first I'd like to make an account for you so I can remember them.  What's your email address?";

  // Convert IDs into names
  //   const rawCategories = await Promise.all(
  //     userCategoryIDs.map(id => Categories.retrieve({ id }).first())
  //   );
  //   const categories = cleanCategories(rawCategories);

  const carousels =
    user.email || email
      ? await Promise.all(
          userCategoryIDs.map(async category_id => {
            const books = await BookCategories.retrieve({ category_id });
            const book_ids = books.map(bc => bc.book_id);

            return {
              attachment: {
                type: 'template',
                payload: {
                  template_type: 'generic',
                  elements: await Promise.all(
                    await book_ids.map(async id => {
                      const b = await Books.retrieve({ id }).first();
                      const buttons = [];
                      if (b.synopsis) {
                        buttons.push({
                          type: 'postback',
                          title: 'Read Synopsis',
                          payload: JSON.stringify({
                            command: 'get_synopsis',
                            book_id: b.id
                          })
                        });
                      }
                      buttons.push({
                        type: 'postback',
                        title: 'Start Summary',
                        payload: JSON.stringify({
                          command: 'get_summary',
                          book_id: b.id
                        })
                      });

                      return {
                        title: b.title,
                        image_url: b.image_url,
                        subtitle: `by ${b.author}`,
                        buttons
                      };
                    })
                  )
                }
              }
            };
          })
        )
      : null;

  console.log('CAR: ', await carousels);

  return [{ text }, await carousels];
}
