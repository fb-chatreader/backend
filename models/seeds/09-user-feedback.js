
const feedback = {
  feedback_score: 5,
  additional_feedback: ''
};

exports.seed = function(knex) {
  // delete all entries
  const page_id = process.env.PAGE_ID;

  return knex('user_feedback').insert(
    feedback.map((datum) => {
      // if (!book.rating_qty || !book.avg_rating) {
      //   book = await getRating(book);
      // }
      const { feedback_score, additional_feedback } = datum;

      return {
        feedback_score,
        additional_feedback
      };
    })
  );
};
