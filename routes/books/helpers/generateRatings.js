const Books = require('../../../models/db/books');
const createJSON = require('../../utils/create-json-file');
const path = '/Users/erikkimsey/Desktop/sidd/models/seeds/allBooks/ratings.json';

/**
 * This is an utility function to generate mock book ratings data and create ratings.json file containing generated data.
 */
module.exports = async (books) => {
  const booksToJsonArr = [];
  await Books.retrieve().then((books) => {
    console.log(books.length);
    for (let i = 0; i < books.length; i++) {
      console.log(i);
      booksToJsonArr.push(generateRatingObj());
    }
  });
  createJSON(booksToJsonArr, path);
};

function generateRatingObj() {
  return {
    avg_rating: generateAvgRating(5, 1),
    rating_qty: generateRatingQty(500)
  };
}

function generateAvgRating(max, min) {
  return Math.floor(Math.random() * ((max - min) * 10) + 10) / 10;
}

function generateRatingQty(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
