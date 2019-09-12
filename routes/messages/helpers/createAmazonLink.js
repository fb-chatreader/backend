module.exports = (book) => {
	const amazonPrefix = 'www.amazon.com/s?k=';
	const amazonLinkArr = book.split(' ');
	const firstElem = amazonLinkArr[0];
	if (amazonLinkArr.length === 1) return amazonPrefix + '' + amazonLinkArr[0];
	if (amazonLinkArr.length > 1) {
		const slicedArr = amazonLinkArr.slice(1);
		return slicedArr.reduce((acc, curr) => {
			return acc + '+' + curr;
		}, amazonPrefix + '+' + firstElem);
	}
};
