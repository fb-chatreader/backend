/**
 * Quick reply template
 * - content_type (text),
 * - title,
 * - image,
 * - payload,
 * 
 */

module.exports = (params, event) => {
  const { command, title, category_id, isAdded } = params;
  console.log('command');
  console.log('command');
  console.log('command');
  console.log('command');
  console.log(params);
  return {
    content_type: 'text',
    title,
    payload: JSON.stringify({
      command: command,
      looped_from: command,
      category_id: category_id,
      isAdded: isAdded
    })
  };
};

//define and return payload
function createPayload(payload) {}
