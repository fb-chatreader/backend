// Will get a set of 10 random books based on either provided category IDs or user's preferences
// Will not return any books currently in the user's library
const BookCategories = require('models/db/bookCategories.js');
const UserCategories = require('models/db/userCategories.js');
const UserLibraries = require('models/db/userLibraries.js');

module.exports = async (user_id, categoryIDs) => {
  // If no category IDs are provided, it will look up the user's preferences and use those
  // categoryIDs can be a single ID by itself or any number wrapped in an array.  However, only a max of 10 will be used
  if (!categoryIDs) {
    categoryIDs = await UserCategories.retrieve({ user_id }).map((uc) => uc.category_id);
  }

  const userLibrary = await UserLibraries.retrieve({ user_id });
  // Keep array at a max of length = 10
  categoryIDs = Array.isArray(categoryIDs) ? categoryIDs : [ categoryIDs ];
  categoryIDs.splice(10);
  const booksPerCategory = Math.floor(10 / categoryIDs.length);
  const firstCategoryLength = 10 % categoryIDs.length + booksPerCategory;

  // books = [[first category books], [secondary category books], [etc]]
  const allBooks = await Promise.all(categoryIDs.map((category_id) => BookCategories.retrieve({ category_id })));
  const books = [];
  for (let i = 0; i < 10; i++) {
    // Push X number of the first category, second category, etc.  Any remainder from 10 / number of categories gets
    // put into the first category
    const index = i < firstCategoryLength ? 0 : Math.floor((i - firstCategoryLength) / booksPerCategory) + 1;

    const categoryBooks = allBooks[index];

    const rIndex = Math.round(Math.random() * (categoryBooks.length - 1));

    let book = categoryBooks.splice(rIndex, 1)[0];
    console.log('userLibrary');
    console.log('userLibrary');
    console.log('userLibrary');
    console.log(userLibrary);

    while (userLibrary.find((l) => l.book_id === book[0].id)) {
      const rIndex = Math.round(Math.random() * (categoryBooks.length - 1));
      book = categoryBooks.splice(rIndex, 1)[0];
    }

    books.push(book);
  }

  return books;
};
