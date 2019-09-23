/**
 * Quick reply template
 * - content_type (text),
 * - title,
 * - image,
 * - payload,
 * 
 */

module.exports = (params) => {
  const { command, title, category_id, isRemoved } = params;

  return {
    content_type: 'text',
    title,
    payload: JSON.stringify({
      command: command,
      looped_from: command,
      category_id: category_id,
      isRemoved: isRemoved === true
    })
  };
};
