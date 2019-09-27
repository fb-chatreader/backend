// *** To Do:
// upon new request check user_tracking table for last book id
// get a set of 10 books and send in response to client. If last book id was found in user tracking, these should be a new batch
// update user_tracking table with last book id
// on subsequent requests, check last book id in user tracking, rinse, and repeat
// ***

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

<<<<<<< HEAD
  const sortedBooks = sortBooks(booksInCategory);

  // Get current sorted book index for the first category to start the new batch of books:
  const recommendedBookRecord = await RecommendedBooks.retrieve({
    user_id,
    category_id
  }).first();

  const startSortedBookIndex = recommendedBookRecord
    ? recommendedBookRecord.current_sorted_book_index
    : 0;

  const endSortedBookIndex = startSortedBookIndex + 10;

  const books = sortedBooks.slice(startSortedBookIndex, endSortedBookIndex);

  recommendedBookRecord
    ? await RecommendedBooks.edit(
        { user_id, category_id },
        { current_sorted_book_index: endSortedBookIndex }
      )
    : await RecommendedBooks.add({
        user_id,
        current_sorted_book_index: endSortedBookIndex,
        category_id
      });

=======
  // Get all books divided into arrays for each category:
  // allBooks = [[first category books], [secondary category books], [etc]]
  const allBooks = await Promise.all(categoryIDs.map((category_id) => sortBooks({ category_id })));
  // console.log('allBooks[0]:', allBooks[0]);

  // Hard code index for first category in allBooks and get that array of  books:
  const categoryIndex = 0;
  const categoryBooks = allBooks[categoryIndex];

  // Check for record in recommended_books table:
  const recommendedBookRecord = await RecommendedBooks.retrieve({ user_id }).first();

  // Get current sorted book index to start the new batch of books:
  const startSortedBookIndex = recommendedBookRecord ? recommendedBookRecord.current_sorted_book_index : 0;
  // Set the end index for the batch, not to exceed length of remaining books:
  const remainingBookCount = (categoryBooks.length - 1) - startSortedBookIndex;
  const endSortedBookIndex = remainingBookCount >= 9 ? startSortedBookIndex + 9 : startSortedBookIndex + remainingBookCount;

  // Update the current_sorted_index in recommended_books table to be used on the next round:
  const newSortedBookIndex = remainingBookCount <= 9 ? 0 : endSortedBookIndex + 1;
  if (recommendedBookRecord) {
    await RecommendedBooks.edit({ user_id }, { current_sorted_book_index: newSortedBookIndex});
  } else {
    await RecommendedBooks.add({ 
      user_id,
      current_sorted_book_index: newSortedBookIndex,
      category_id: categoryIDs[0]  // assumes categoryIDs arg was provided, and it only has one element
    });
  }

  const books = [];
  for (let i = startSortedBookIndex; i <= endSortedBookIndex; i++) {
    books.push(categoryBooks[i]);

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
  }
  
>>>>>>> master
  return books;
};
