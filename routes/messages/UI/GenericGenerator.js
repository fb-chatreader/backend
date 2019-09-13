const generateButtons = require('routes/messages/UI/ButtonGenerator.js');
console.log(generateButtons);

/**
 * Dynamically generates messenger buttons
 * Params:
 * - "content" (object) = {
 *  type:String, 
 *  template_type:String, 
 *  elements:Array, 
 *  buttons:Array
 * }
 */
module.exports = async (content) => {
  const { type, template_type, elements, buttons } = content;

  return {
    attachment: {
      type: type,
      payload: {
        template_type: template_type,
        elements: generateElements(elements, buttons)
      }
    }
  };
};

const generateElements = function(elemArr, buttons) {
  return elemArr.map((e) => {
    return {
      title: e.title,
      image_url: e.image_url,
      subtitle: e.subtitle,
      default_action: {
        type: e.da_type,
        url: e.da_url,
        webview_height_ratio: e.webview_height_ratio
      },
      buttons: generateButtons(buttons)
    };
  });
};
