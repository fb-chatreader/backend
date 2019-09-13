/**
 * Dynamically generates messenger buttons
 * Params:
 * - content: (Array) containing Button object values
 */
module.exports = async (content) => {
  const { buttons } = content;
  return generateButtons(buttons);
};

const generateButtons = function(btnArr) {
  return btnArr.map((e) => {
    return {
      type: e.type,
      url: e.url,
      title: e.title
    };
  });
};
