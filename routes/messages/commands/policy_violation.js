const Violations = require('models/db/violations.js');

module.exports = async event => {
  const { action, reason, page_id } = event;
  if (event.type === 'policy_violation') {
    await Violations.write({ page_id, action, reason });
  }
  return null;
};
