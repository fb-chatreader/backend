// this helper function creates an amazon link from a chosen book title
module.exports = (book) => {
  const amazonPrefix = 'www.amazon.com/s?k=';
  const amazonLinkArr = book.split(' ').join('+');
  return amazonPrefix + amazonLinkArr;
};
