module.exports = { generateWebButtons, generatePostbackButtons };

/**
 * Dynamically generates messenger buttons
 * Params:
 * - "buttons" (array of objects) = [{
 *  title:String,
 *  url:String,
 * }]
 */

function generateWebButtons(buttons) {
  // Requires a title and URL for each button
  return buttons.map(({ title, url }) => {
    return {
      type: 'web_url',
      title,
      url
    };
  });
}

/**
 * Dynamically generates messenger buttons
 * Params:
 * - "buttons" (array of objects) = [{
 *  title:String,
 *  payload:Array (of Objects),
 * }]
 */

function generatePostbackButtons(buttons) {
  // Requires a title and a payload OBJECT that will be stringified.
  return buttons.map(({ title, payload }) => {
    return {
      type: 'postback',
      title,
      payload: JSON.stringify(payload)
    };
  });
}
