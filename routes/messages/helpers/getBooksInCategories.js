// *** To Do:
// upon new request check user_tracking table for last book id
// get a set of 10 books and send in response to client. If last book id was found in user tracking, these should be a new batch
// update user_tracking table with last book id
// on subsequent requests, check last book id in user tracking, rinse, and repeat
// ***

const UserCategories = require('models/db/userCategories.js');
const BookCategories = require('models/db/bookCategories.js');
const sortBooks = require('../../books/helpers/sortBooksByRating');
const RecommendedBooks = require('models/db/recommendedBooks.js');

module.exports = async (user_id, category_id) => {
  if (!category_id) {
    // Default behavior is to grab their first category if one is not provided
    const first_category = await UserCategories.retrieve({ user_id }).first();
    category_id = first_category.category_id;
  }

  const booksInCategory = await BookCategories.retrieve({ category_id });

  const sortedBooks = sortBooks(booksInCategory);
  const bookCount = sortedBooks.length;
  // console.log('Books in category: ', bookCount);

  // Get current sorted book index for the first category to start the new batch of books:
  const recommendedBookRecord = await RecommendedBooks.retrieve({
    user_id,
    category_id
  }).first();

  const startSortedBookIndex = recommendedBookRecord ? recommendedBookRecord.current_sorted_book_index : 0;

  // const endSortedBookIndex = startSortedBookIndex + 10;
  const endSortedBookIndex = startSortedBookIndex + 10;

  const books = sortedBooks.slice(startSortedBookIndex, endSortedBookIndex);

  recommendedBookRecord
    ? await RecommendedBooks.edit(
        { user_id, category_id },
        {
          current_sorted_book_index: endSortedBookIndex >= bookCount ? 0 : endSortedBookIndex
        }
      )
    : await RecommendedBooks.add({
        user_id,
        current_sorted_book_index: endSortedBookIndex,
        category_id
      });

  return { isEndOfCategory: endSortedBookIndex >= bookCount, books };
};
