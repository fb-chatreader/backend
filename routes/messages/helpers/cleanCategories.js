module.exports = categoriesArray => {
  // Mutates the objects so no need to return
  categoriesArray.forEach(c => {
    for (category in c) {
      if (c[category] === null) {
        delete c[category];
      }
    }
  });
};
