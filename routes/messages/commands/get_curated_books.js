const Categories = require('models/db/categories');
const UserCategories = require('models/db/userCategories');
const BookCategories = require('models/db/bookCategories.js');
const sortBooks = require('../../books/helpers/sortBooksByRating');
const UserLibrary = require('models/db/userLibraries.js');
const UserTracking = require('models/db/userTracking.js');

// * NOTE: This strategy returns only books from the user's saved categories.
    // * The number of books sent from each category is based on a category score, 
    // * calculated based on how many library books the user has from each category
    // * and how many book summaries they have read from that category.
    // * It's possible for a user to have library books from categories other than their saved categories
    // * and to have read summaries from other categories.
    // * In that case, it could make sense to include curated books from other categories.
    // * But for now, the "algorithm" privileges the user's saved categories over all others.

module.exports = async function(Event) {
    const { user_id, page_id } = Event;

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
        });
    // console.log('userBookSummariesRead:', userBookSummariesRead);

    // Update the score for each category in userCatScores:
    userCatScores.forEach(cat => {
        userLibraryBooks.forEach(book => {
            if (cat.category_id === book.category_id) {
                cat.score++;
            }
        });
        userBookSummariesRead.forEach(book => {
            if (cat.category_id === book.category_id) {
                cat.score++;
            }
        });
    });
    // console.log('userCatScores:', userCatScores);

    // Sort user categories by score highest to lowest:
    const sortedUserCatScores = userCatScores.sort((a, b) => {
        return b.score - a.score;
    });

    // First attempt at creating curated books array:
    // const curatedBooks = sortedUserCatScores.map(async cat => {
    //     const books = await BookCategories.retrieve({ category_id: cat.category_id });
    //     const sortedBooks = sortBooks(books);
    //     const filteredBooks = sortedBooks.filter(sb => {
    //         return userLibraryBooks.some(lb => {
    //           return lb.id === sb.id;
    //         });
    //       });
    //     return filteredBooks.slice(0, 2);
    // });
    // console.log('curatedBooks:', curatedBooks);

    // Second attempt at curated books array:
    const curatedBooks = [];

    for (let i = 0; i < sortedUserCatScores.length; i++) {
        const books = await BookCategories.retrieve({ category_id: sortedUserCatScores[i].category_id });
        const filteredBooks = books.filter(b => {
            return userLibraryBooks.some(lb => {
              return lb.id === b.id;
            });
          });
        const sortedBooks = sortBooks(filteredBooks).slice(0, 5);
        console.log(sortedBooks);
    }
    
    // *** 
    // Build/populate the book carousel:
    // ***

    // const text = `Would you like to bowse more books?`;
    // const quickReplies = [];
    // const options = [
    //     {
    //         title: 'Browse books',
    //         command: 'browse'
    //     }
    // ];

    // options.forEach(opt => {
    //     const { title, command, category_id } = opt;

    //     quickReplies.push({
    //         title,
    //         payload: JSON.stringify({
    //             command: command.toLowerCase(),
    //             category_id
    //         })
    //     });
    // });

    // return [
    //     this.sendTemplate('Book', Event, books),
    //     this.sendTemplate('QuickReply', text, quickReplies)
    // ];
};
