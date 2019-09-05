const Violations = require('models/db/violations.js');

module.exports = async input => {
  const { action, reason, page_id } = input;
  if (input.type === 'policy_violation') {
    await Violations.write({ page_id, action, reason });
  }
  return null;
};
