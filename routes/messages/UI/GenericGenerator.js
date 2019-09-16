const { generateElements } = require('routes/messages/UI/helpers/generic.js');

/**
 * Dynamically generates messenger buttons
 * Params:
 * - "content" (object) = {
 *  elements:Array,
 *  buttons:Array
 * }
 */
module.exports = async content => {
  const { elements, buttons } = content;

  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: generateElements(elements, buttons)
      }
    }
  };
};
