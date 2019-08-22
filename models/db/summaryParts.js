const db = require('../dbConfig.js');

module.exports = {
  retrieve,
  retrieveBlock,
  write,
  edit,
  remove
};

function retrieve(filter) {
  if (filter) {
    return db('summary_parts').where(filter);
  }
  return db('summary_parts');
}

async function retrieveBlock(filter, firstID) {
  // whereBetween will include last number.  If we're at firstID = 1 and want to show 5
  // in a block, 1 + 5 = 6.  Thus, 6 will be included, so -1 to set it back to 1-5
  const lastID = firstID + (parseInt(process.env.BLOCK_LENGTH, 10) || 3) - 1;

  const book_summaries = await db('summary_parts').where(filter);
  const last_summary = book_summaries[book_summaries.length - 1].id;
  const block = await db('summary_parts')
    .select('summary')
    .where(filter)
    .whereBetween('id', [firstID, lastID]);
  return {
    isFinal: last_summary >= firstID && last_summary <= lastID,
    block
  };
}

function write(summary) {
  return db(`summary_parts`)
    .insert(summary, ['*'])
    .then(s => retrieve({ id: s[0].id }).first());
}

function edit(summaryid, summary) {
  return db('summary_parts')
    .where({ id: summaryid })
    .update(summary);
}

function remove(summaryid) {
  return db('users')
    .where({ id: summaryid })
    .del();
}
