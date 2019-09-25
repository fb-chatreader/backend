const axios = require('axios');
const Books = require('../../../models/db/books');
const fetchedRatings = './ratings_fetch.json';
const storeData = require('../../../routes/utils/create-json-file');


module.exports = () => {
  const url = 'https://www.googleapis.com/books/v1/volumes?q=';

  Books.retrieve().then((books) => {
    books.forEach(async (b, i) => {
      const fullURL = `${url}${b.title
        // .replace(/[^\w\s]/gi, '')
        .toLowerCase()}+inauthor:${b.author.toLowerCase()}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;

      setTimeout(async () => {
        try {
          const res = await axios.get(fullURL);
          console.log('res');
          console.log(res.data.items[0].volumeInfo.title);

          // ratings = res.data.items.map(({ volumeInfo }) => {
          //   const title = b && b.title ? b.title.toLowerCase() : null;
          //   const volumeTitle = volumeInfo && volumeInfo.title ? volumeInfo.title.toLowerCase() : null;
          //   console.log(title);
          //   console.log(volumeTitle);

          //   if (title && volumeTitle && title === volumeTitle) {
          //     const { averageRating, ratingsCount } = volumeInfo;
          //     return {
          //       averageRating: averageRating,
          //       ratingsCount: ratingsCount
          //     };
          //   }
          // });
        } catch (err) {
          console.log('ERROR ON: ', fullURL);
          console.log('ERROR ON: ', err);
        }
      }, 500 * i);
    });
  });
  console.log(ratings);

  // .catch((err) => console.log('ERROR: ', err.response.data));
  // storeData(ratings, fetchedRatings);
};
