// const Books = require('../../../models/db/books');
const Books = require('../../../models/seeds/allBooks/books.json');
const createJSON = require('../../utils/create-json-file');
const path = '/Users/erikkimsey/Desktop/sidd/models/seeds/allBooks/ratings.json';
const ratings = '../../../models/seeds/allBooks/ratings.json';

/**
 * This is an utility function to generate mock book ratings data and create ratings.json file containing generated data.
 */
const generateRatings = async (books) => {
  const booksToJsonArr = [];
  // console.log(Books.length);
  // await Books.retrieve().then((book) => {
  //   console.log(book.length);
  if (Books.length === 349) {
    for (let i = 0; i < 349; i++) {
      // console.log(Books.img_url);
      // console.log(i);
      console.log(generateRatingObj());

      booksToJsonArr.push(generateRatingObj());
    }
    // console.log('booksToJsonArr.length');
    // console.log(booksToJsonArr.length);

    createJSON(booksToJsonArr, path);
  }
  // });
  // console.log('ratings length');
  // console.log(ratings.length);
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

// generateRatings();
