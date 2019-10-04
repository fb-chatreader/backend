const Books = require('models/db/books.js');
const getRating = require("routes/books/helpers/getRating.js");

module.exports = () => {
  Books.retrieve()
    .then(books => {
      console.log(`Checking ratings for ${books.length} books`);
      books.forEach(async (b, i, arr) => {
        setTimeout(async () => {
          // setTimeout to avoid spamming API with 1000+ requests at once
          const {...id, noID} = getRating(b);
          Books.edit({ id }, noID);
        }, 250 * i);
      });
    })
    .catch(err => console.log('ERROR: ', err.response.data));
};
