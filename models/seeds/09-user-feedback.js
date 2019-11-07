const generateDummyUserData = require('../seeds/feedback/generateFeedback');

console.log(generateDummyUserData(5));
const feedback = generateDummyUserData(5);

exports.seed = function(knex) {
  return knex('user_feedback').insert(
    feedback.map((datum) => {
      const { feedback_score, additional_feedback, email } = datum;

      return {
        feedback_score,
        additional_feedback,
        email
      };
    })
  );
};
