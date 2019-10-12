const getRating = require('../../../routes/books/helpers/getRating.js');
const books = require('./books.json');
const fs = require('fs');
const location = 'models/seeds/allBooks/updated_books.json';

books
  .slice(0, 200)
  .reduce((acc, b, i) => {
    return acc.then(async resolved => {
      console.log(`${i} of ${books.length}`);
      const book = await getRating(b);
      if (book) {
        const { summary, synopsis, headers, ...rest } = book;
        resolved.push(book);

        return resolved;
      } else {
        console.error('Error retrieving reviews for: ', b.title);
      }
    });
  }, Promise.resolve([]))
  .then(allBooks => {
    saveBooks(allBooks);
  });

function saveBooks(books) {
  fs.writeFile(location, JSON.stringify(books), err => {
    if (err) {
      return console.log('ERROR SAVING: ', err);
    }
    console.log('The file was saved!');
  });
}
