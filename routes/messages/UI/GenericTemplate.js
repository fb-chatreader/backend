/**
 * Dynamically generates Generic Template object for the Messenger API
 * Params:
 * - "elements" (array of objects) = [{
 *  title:String,
 *  subtitle:String,
 *  image_url:String,
 *  default_action: Object,
 *  buttons:Array (of Objects)*
 * }]
 *
 * * default_action (optional, action taken when card is clicked): {
 *    "type": "web_url",
 *    "url": "<DEFAULT_URL_TO_OPEN>",
 *    "messenger_extensions": <TRUE | FALSE >,
 *    "webview_height_ratio": "<COMPACT | TALL | FULL>" NOTE: this property applies ONLY to the messenger_extension
 *   }
 *
 * * buttons: [{
 *    type:String ("web_url", "postback"),
 *    url/payload:String (url for web_url, payload for postback),
 *    title:String
 *   }]
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
