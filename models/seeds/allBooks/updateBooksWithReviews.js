const getRating = require('../../../routes/books/helpers/getRating.js');
const books = require('./books.json');
const fs = require('fs');
const location = 'models/seeds/allBooks/updated_books.json';
// const updated = require('./updated_books.json');

const saveBook = ((counter, timeout) => book => {
  if (timeout) {
    clearInterval(timeout);
  }
  timeout = setTimeout(() => (counter = 0), 5000);
  counter++;

  setTimeout(
    () =>
      fs.readFile(location, (err, data) => {
        if (err) {
          return console.log('READ ERROR: ', err);
        }
        const books = JSON.parse(data);
        books.push(book);
        fs.writeFile(location, JSON.stringify(books), function(err) {
          if (err) {
            return console.log(err);
          }

          console.log('The file was saved!');
        });
      }),
    250 * counter
  );
})(0, null);

books.slice(800, 1000).reduce((acc, b, i, arr) => {
  return acc.then(async () => {
    // console.log(`${i} of ${books.length}`);
    const book = await getRating(b);

    console.log(
      `${i} of ${arr.length - 1} = ${((i / (arr.length - 1)) * 100)
        .toString()
        .substring(0, 5)}`
    );

    if (book) {
      saveBook(book);
    } else {
      console.error('Error retrieving reviews for: ', b.title);
    }
  });
}, Promise.resolve([]));
