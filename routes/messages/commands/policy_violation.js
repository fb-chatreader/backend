const Violations = require('../../../models/db/violations.js');

module.exports = async event => {
  const { action, reason, page_id } = event;
  if (event.type === 'webhook') {
    await Violations.write({ page_id, action, reason, created_at: new Date() });
  }
  return null;
};
