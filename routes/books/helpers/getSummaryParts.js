module.exports = summary => {
  // Replace double spaces with a single for a standard format
  // Replace all punctuation with an extra space
  const extraSpace = summary
    .replace(/\s\s+/g, ' ')
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
