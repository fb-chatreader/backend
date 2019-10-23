const UserTracking = require('models/db/userTracking.js');

module.exports = async (user_id, book_id, current_summary_id) => {
  const progressOnBook = await UserTracking.retrieve({
    user_id,
    book_id
  }).first();

  !progressOnBook
    ? await UserTracking.add({
        user_id,
        book_id,
        last_summary_id: current_summary_id
      })
    : await UserTracking.edit(
        { user_id, book_id },
        {
          last_summary_id: current_summary_id,
          repeat_count: progressOnBook.repeat_count + 1
        }
      );
};
