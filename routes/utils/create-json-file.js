const fs = require('fs');

module.exports = (book, path) => {
  fs.readFile(path, (err, data) => {
    const books = JSON.parse(data);
    // console.log(books);

    // books.push(book);
    fs.writeFile(path, JSON.stringify(book), function(err) {
      if (err) {
        return console.log(err);
      }
      console.log('The file was saved!');
    });
  });
};
