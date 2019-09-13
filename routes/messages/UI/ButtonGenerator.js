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
      title: e.title,
      url: null || e.url,
      payload: null || e.payload
    };
  });
};
