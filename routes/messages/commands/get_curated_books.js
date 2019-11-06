const Categories = require('models/db/categories');
const UserCategories = require('models/db/userCategories');
const BookCategories = require('models/db/bookCategories.js');
const sortBooks = require('../../books/helpers/sortBooksByRating');
const UserLibrary = require('models/db/userLibraries.js');
const UserTracking = require('models/db/userTracking.js');

module.exports = async function(Event) {
    const { user_id, page_id } = Event;
    // *** Steps:
        // const userCatScores = user's selected/saved categories; array of objects to count cat score
            // e.g., userCatScores = [{categoryId: 1, count: 0}, {categoryId: 5, count: 0}, {categoryId: 3, count: 0}]
        // const allBooksFromCats = all books from user's saved categories
        // const userLibraryBooks = all books from user's library
        // const userSummaryReads = books for which user has read the summary, from user tracking table
        // update scores in userCatScores based on library books and summary reads

    // Get user's categories and create array to track score for each category:
    const userCats = await UserCategories.retrieve({ user_id });
    const userCatScores = userCats.map(cat => ({category_id: cat.category_id, score: 0}));

    // Get books in the user's library (doesn't include category_id for each book),
    // and map over the result, replacing each book with a book that includes category_id
    // by querying BookCategories:
    const userLibraryBooks = await UserLibrary
        .retrieve({ user_id, page_id })
        .map(async book => {
            return book = await BookCategories.retrieve({ book_id: book.id }).first();
        });
    // console.log('userLibraryBooks:', userLibraryBooks);

    // Get entries for the user in the user_tracking table:
    const userBookSummariesRead = await UserTracking
        .retrieve({ user_id })
        .map(async book => {
            return book = await BookCategories.retrieve({ book_id: book.id }).first();
        })
    console.log('userBookSummariesRead:', userBookSummariesRead);


    // Get all books from each category 
    // *** may remove later and get books one cat at a time for sorting and filteriing ***
    // const allBooksFromCats = [];
    // for (let cat of userCats) {
    //     let books = await BookCategories.retrieve({ category_id: cat.category_id });
    //     allBooksFromCats.push({ category_id: cat.category_id, books });
    // }

//   const text = `Would you like to see more books on ${category.name}?`;
//   const quickReplies = [];
//   const options = [
//     {
//       title: 'More',
//       command: 'get_books_from_category',
//       category_id
//     },
//     {
//       title: 'Other',
//       command: 'browse'
//     }
//   ];

//   options.forEach(opt => {
//     const { title, command, category_id } = opt;

//     quickReplies.push({
//       title,
//       payload: JSON.stringify({
//         command: command.toLowerCase(),
//         category_id
//       })
//     });
//   });

//   return [
//     this.sendTemplate('Book', Event, books),
//     isEndOfCategory
//       ? this.getReturnFrom(Event, 'browse')
//       : this.sendTemplate('QuickReply', text, quickReplies)
//   ];
};
