const fs = require('fs');
const path = '../models/seeds/allBooks/ratings.json';
console.log(path);


module.exports = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};
