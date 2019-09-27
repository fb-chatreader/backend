const fs = require('fs');
const axios = require('axios');
const Books = require('models/db/books.js');
const PATH = '/Users/erikkimsey/Desktop/sidd/models/seeds/allBooks/ratings_2.json';
const url = 'https://www.googleapis.com/books/v1/volumes?q=';
const booksWithReviews = [];

function makeJSON(arr, path) {
  console.log(arr);
  fs.writeFile(path, JSON.stringify(arr), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('The file was saved!');
  });
}

function analyzeAuthorName(name) {
  // check if [1] is null,
  // if so, return [0] (if it is not null)
  let authorArr = name.split(' ');
  let cleanedArr = authorArr.map((e) => {
    return e.replace(/[^\w\s]/gi, '').toLowerCase();
  });

  if (cleanedArr[1] !== null && cleanedArr[1] !== undefined) {
    return cleanedArr[1];
  } else if (cleanedArr[0] !== null && cleanedArr[0] !== undefined) {
    return cleanedArr[0];
  }
}

function bookRatings() {
  Books.retrieve()
    .then((books) => {
      const counts = {
        notFound: 0,
        noRating: 0,
        error: 0,
        success: 0
      };

      books.forEach(async (b, i, arr) => {
        // Add check for author name being one word
        const author = analyzeAuthorName(b.author);

        console.log('TITLE w/ AUTHOR: ', `${b.title} ..by.. ${author}`);

        const fullURL = `${url}${b.title.replace(/[^\w\s]/gi, '').toLowerCase()}+inauthor:${author}&key=${process.env
          .GOOGLE_BOOKS_API_KEY}`;

        // console.log(fullURL);
        setTimeout(async () => {
          try {
            const res = await axios.get(fullURL);
            let found = false;

            for (let i = 0; i < res.data.items.length; i++) {
              const { volumeInfo } = res.data.items[i];
              const title = b && b.title ? b.title.toLowerCase() : null;
              const volumeTitle = volumeInfo && volumeInfo.title ? volumeInfo.title.toLowerCase() : null;

              if (title && volumeTitle && title === volumeTitle) {
                found = true;
                const { averageRating, ratingsCount } = volumeInfo;
                if (averageRating && ratingsCount) {
                  counts.success++;
                  booksWithReviews.push({
                    ...b,
                    avg_rating: averageRating,
                    rating_qty: ratingsCount
                  });

                  // console.log(`${b.title}: ${volumeInfo.averageRating} rating with ${volumeInfo.ratingsCount} reviews`);
                } else {
                  booksWithReviews.push({ ...b, avg_rating: 0, rating_qty: 0 });
                  console.log('No rating');
                  counts.noRating++;
                }
                break;
              }
            }
            if (!found) {
              booksWithReviews.push({ ...b, avg_rating: 0, rating_qty: 0 });
              counts.notFound++;
            }
            found = false;
          } catch (err) {
            counts.error++;
            console.log('ERROR ON: ', fullURL);
          }
          if (i === arr.length - 1) {
            console.log('COUNTS: ', counts);
            console.log('TOTAL: ', books.length);
            Promise.all(
              booksWithReviews.map((b) => {
                const { id, ...noID } = b;
                Books.edit({ id: b.id }, noID);
              })
            );
          }
        }, 500 * i);
      });
    })
    .catch((err) => console.log('ERROR: ', err.response.data));
}

bookRatings();
