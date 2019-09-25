const axios = require('axios');
const Books = require('models/db/books.js');
const storeData = require('./routes/utils/create-json-file.js');
console.log('storeData');
console.log('storeData');
console.log('storeData');
console.log(storeData);

const url = 'https://www.googleapis.com/books/v1/volumes?q=';

Books.retrieve()
  .then((books) => {
    books.forEach(async (b, i) => {
      const fullURL = `${url}${b.title
        .replace(/[^\w\s]/gi, '')
        .toLowerCase()}+inauthor:${b.author.toLowerCase()}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;

      /**
       * - map res.data.items,
       * --- 
       * - pass array to create-json-file.js (w/ path)
       */

      setTimeout(async () => {
        try {
          const res = await axios.get(fullURL);
          const ratings = res.data.items.map(({ volumeInfo }) => {
            const title = b && b.title ? b.title.toLowerCase() : null;
            const volumeTitle = volumeInfo && volumeInfo.title ? volumeInfo.title.toLowerCase() : null;
            if (title && volumeTitle && title === volumeTitle) {
              return ({ averageRating, ratingsCount } = volumeInfo);
            }
          });
        } catch (err) {
          console.log('ERROR ON: ', fullURL);
        }
      }, 500 * i);
      storeData(ratings);
    });
  })
  .catch((err) => console.log('ERROR: ', err.response.data));
