const books = require('./books.json');
const ratings = require('./ratings.json');
console.log('BOOKS LENGTH');
console.log(books.length);

let count = 0;
ratings.forEach((e, i) => {
  if (e.rating_qty && e.avg_rating) {
    count++;
    // console.log('QTY');
    // console.log(e.rating_qty);
    // console.log('AVG');
    // console.log(e.avg_rating);
  }
});
console.log('count');
console.log(count);
