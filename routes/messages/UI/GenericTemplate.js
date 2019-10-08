const { generateElements } = require('routes/messages/UI/helpers/generic.js');

/**
 * Dynamically generates Generic Template object for the Messenger API
 * Params:
 * - "elements" (array of objects) = [{
 *  title:String,
 *  subtitle:String,
 *  image_url:String,
 *  buttons:Array (of Objects)*
 * }]
 *
 * * buttons: [{
 *    type:String ("web_url", "postback"),
 *    url/payload:String (url for web_url, payload for postback),
 *    title:String
 * }]
 */
module.exports = elements => {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: elements.slice(0, 10)
      }
    }
  };
};
