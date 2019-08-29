exports.up = function(knex) {
  return knex.schema.createTable('categories', tbl => {
    tbl.increments();
    tbl.text('architecture');
    tbl.text('art');
    tbl.text('biography');
    tbl.text('other');
    tbl.timestamp('created_at', { useTz: true });
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('categories');
};

// other categories for later
// crafts_hobbies varchar
// drama varchar
// education varchar
// family_relatioships varchar
// foreign_languages varchar
// games varchar
// gardening varchar
// health varchar
// history varchar
// house varchar
// humor varchar
// languages varchar
// law varchar
// literary varchar
// math varchar
// medical varchar
// music varchar
// nature varchar
// performing_arts varchar
// pets varchar
// philosophy varchar
// photography varchar
// poetry varchar
// political_science varchar
// psychology varchar
// reference varchar
// religion varchar
// science varchar
// self_help varchar
// social_science varchar
// sports varchar
// technology varchar
// transportation varchar
// travel varchar
// true_crime varchar
// other varchar
