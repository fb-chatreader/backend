const generateDummyUserData = require('../seeds/feedback/generateFeedback');

exports.seed = function(knex) {
  const feedback = generateDummyUserData(5);
  return knex('user_feedback').insert(
    feedback.map(datum => {
      const { feedback_score, additional_feedback, email } = datum;

      return {
        score: feedback_score,
        notes: additional_feedback,
        email
      };
    })
  );
};
