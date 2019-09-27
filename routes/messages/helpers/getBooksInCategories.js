// *** To Do:
// upon new request check user_tracking table for last book id
// get a set of 10 books and send in response to client. If last book id was found in user tracking, these shoud be a new batch
// update user_tracking table with last book id
// on subsequent requests, check last book id in user tracking, rinse, and repeat
// ***

// Will get a set of 10 random books based on either provided category IDs or user's preferences
// Will not return any books currently in the user's library
// const BookCategories = require('models/db/bookCategories.js');
const UserCategories = require('models/db/userCategories.js');
const UserLibraries = require('models/db/userLibraries.js');
const sortBooks = require('../../books/helpers/sortBooksByRating');
const RecommendedBooks = require('models/db/recommendedBooks.js');

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
  const allBooks = await Promise.all(categoryIDs.map((category_id) => sortBooks({ category_id })));
  console.log('allBooks[0]:', allBooks[0]);

  // Get current sorted book index for the first category to start the new batch of books:
  const recommendedBookRecord = await RecommendedBooks.retrieve({ user_id }).first();

  const startSortedBookIndex = recommendedBookRecord ? recommendedBookRecord.current_sorted_book_index : 0;
  const endSortedBookIndex = startSortedBookIndex + 9;
  // Hard code index for first category in allBooks:
  const categoryIndex = 0;
  const categoryBooks = allBooks[categoryIndex];

  const books = [];
  for (let i = startSortedBookIndex; i <= endSortedBookIndex; i++) {
    // Push X number of the first category, second category, etc.  Any remainder from 10 / number of categories gets
    // put into the first category
    // const index = i < firstCategoryLength ? 0 : Math.floor((i - firstCategoryLength) / booksPerCategory) + 1;

    // const categoryBooks = allBooks[index];

    // const rIndex = Math.round(Math.random() * (categoryBooks.length - 1));

    // let book = categoryBooks.splice(rIndex, 1)[0];

    // while (userLibrary.find((l) => l.book_id === book[0].id)) {
    //   const rIndex = Math.round(Math.random() * (categoryBooks.length - 1));
    //   book = categoryBooks.splice(rIndex, 1)[0];
    // }

    // books.push(book);

    books.push(categoryBooks[i]);
  }
  const newSortedBookIndex = endSortedBookIndex + 1;
  if (recommendedBookRecord) {
    await RecommendedBooks.edit({ user_id }, { current_sorted_book_index: newSortedBookIndex});
  } else {
    await RecommendedBooks.add({ 
      user_id,
      current_sorted_book_index: newSortedBookIndex,
      category_id: categoryIDs[0]  // assumes categoryIDs arg was provided, and it only has one element
    });
  }
  
  return books;
};


