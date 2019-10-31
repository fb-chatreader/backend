const Violations = require('models/db/violations.js');

module.exports = async Event => {
  const { action, reason, page_id } = Event;
  if (Event.type === 'policy_violation') {
    await Violations.write({ page_id, action, reason });
  }
  return null;
};
