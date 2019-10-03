const fs = require('fs');

module.exports = (book, path) => {  
  fs.writeFile(path, JSON.stringify(book), function(err) {
    if (err) {
      return console.log(err);
    }
  });
};