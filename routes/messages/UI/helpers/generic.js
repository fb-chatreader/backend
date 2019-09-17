/**
 * Dynamically generates messenger buttons
 * Params:
 * - content: (Array) containing Button object values
 */
module.exports = { generateButtons, generateElements };

function generateButtons(btnArr) {
  return btnArr.map(e => {
    return {
      type: e.type,
      title: e.title,
      url: e.url || null,
      payload: e.payload || null
    };
  });
}

function generateElements(elemArr, buttons) {
  // Will only return at max 10 items (FB API limitation)
  return elemArr.slice(0, 10).map(e => {
    const { title, image_url, subtitle, default_action } = e;
    const element = {
      title,
      image_url,
      subtitle,
      buttons: generateButtons(buttons)
    };
    if (default_action) {
      element.default_action = default_action;
    }

    return element;
  });
}
