const Categories = require('models/db/categories');
const UserCategories = require('models/db/userCategories');
const BookCategories = require('models/db/bookCategories.js');
const sortBooks = require('../../books/helpers/sortBooksByRating');
const UserLibrary = require('models/db/userLibraries.js');

module.exports = async function(Event) {
    const { user_id, page_id } = Event;
    // *** Steps:
        // const userCats = user's selected/saved categories; array of objects to count cat score
            // e.g., userCats = [{categoryId: 1, count: 0}, {categoryId: 5, count: 0}, {categoryId: 3, count: 0}]
        // const allBooks = all books from user's saved categories
        // const libraryBooks = all books from user's library
        // const readBooks = books for which user has read the summary, from user tracking table
        // get top 5 books from top category, removing any books already in the user's library
        // get

    // Get user's categories and create array to track score for each category:
    const userCats = await UserCategories.retrieve({ user_id });
    const userCatScores = userCats.map(cat => ({category_id: cat.category_id, score: 0}));

    // Get all books from each category 
    // *** may remove later and get books one cat at a time for sorting and filteriing ***
    const allBooksFromCats = [];
    for (let cat of userCats) {
        let books = await BookCategories.retrieve({ category_id: cat.category_id });
        allBooksFromCats.push({ category_id: cat.category_id, books });
    }

    const libraryBooks = await UserLibrary.retrieve({ user_id, page_id });
    console.log('libraryBooks:', libraryBooks);
    
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
