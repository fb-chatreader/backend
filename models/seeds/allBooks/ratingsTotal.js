const ratings = require('./ratings.json');
const Books = require('../../db/books');
console.log('WHATTT?');
console.log(Books);

async function funnyStuff() {
  await Books.retrieve()
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
  // console.log(books);
}
console.log();

// console.log(books.length);
funnyStuff();
