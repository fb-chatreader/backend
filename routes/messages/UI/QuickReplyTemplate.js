/**
 * Quick reply template
 * - content_type (text),
 * - title,
 * - image,
 * - payload,
 * 
 */

module.exports = async (categories, event) => {
  const { command } = event;

  const remainingCategories = categories.map((c) => {
    let title = c.name;
    return {
      content_type: 'text',
      title,
      payload: JSON.stringify({
        command: command,
        looped_from: command,
        category_id: c.id,
        isAdding: true
      })
    };
  });
  return remainingCategories;
};

//define and return payload
function createPayload(payload) {}
