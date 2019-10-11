const axios = require('axios');

module.exports = async book => {
  book = { ...book };
  delete book.category;
  // 'book' object only needs a title and author

  const { title } = book;

  const author = analyzeAuthorName(book.author);

  const baseURL = 'https://www.googleapis.com/books/v1/volumes?q=';
  const url = `${baseURL}${title
    .replace(/[^\w\s]/gi, '')
    .toLowerCase()}+inauthor:${author}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;

  try {
    const res = await axios.get(url);
    const length = res.data.items ? res.data.items.length : 0;
    for (let i = 0; i < length; i++) {
      // API returns an array of books based on search query.
      // This loops over those results to find a perfect match, if it exists
      const { volumeInfo } = res.data.items[i];

      if (
        title &&
        volumeInfo.title &&
        title.toLowerCase() === volumeInfo.title.toLowerCase()
      ) {
        found = true;
        const { averageRating, ratingsCount } = volumeInfo;

        // If match is found, return its ratings if they exists
        // If they don't exists, return zeros
        return averageRating && ratingsCount
          ? {
              ...book,
              avg_rating: averageRating,
              rating_qty: ratingsCount
            }
          : { ...book, avg_rating: 0, rating_qty: 0 };
      }
    }
    // If a book is not found, return zeroes
    return { ...book, avg_rating: 0, rating_qty: 0 };
  } catch (err) {
    console.error('Error encountered while finding book in the Google API');
    console.error('Book: ', book);
    console.error('Error: ', err);
  }
};

function analyzeAuthorName(name) {
  // check if [1] is null,
  // if so, return [0] (if it is not null)
  let authorArr = name.split(' ');
  let cleanedArr = authorArr.map(e => {
    return e.replace(/[^\w\s]/gi, '').toLowerCase();
  });

  if (cleanedArr[1] !== null && cleanedArr[1] !== undefined) {
    return cleanedArr[1];
  } else if (cleanedArr[0] !== null && cleanedArr[0] !== undefined) {
    return cleanedArr[0];
  }
}
