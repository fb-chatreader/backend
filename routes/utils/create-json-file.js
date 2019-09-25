const fs = require('fs');
const path = '../../models/seeds/allBooks/ratings.json';

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

module.exports = { storeData };
