module.exports = summary => {
  const extraSpace = summary
    .replace(/[.]/gi, '. ')
    .replace(/[!]/gi, '! ')
    .replace(/[?]/gi, '? ');

  const limit = 320;
  let parts = [];
  let current = '';
  let sentences = extraSpace.split('  ');

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    if ((current + ' ' + sentence).length <= limit) {
      current += ' ' + sentence;
    } else {
      parts.push(current);
      current = '';
    }
  }
  if (current.length) {
    parts.push(current);
    current = '';
  }
  return parts;
};
