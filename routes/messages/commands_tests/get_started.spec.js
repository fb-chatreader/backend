const get_started = require('../commands/get_started.js');
const db = require('../../../models/dbConfig.js');
const Books = require('../../../models/db/books.js');
const Summaries = require('../../../models/db/summaryParts.js');

describe('get_started command tests', () => {
  beforeEach(async () => {
    await db.seed.run();
    await Books.write({
      title: 'First Book',
      author: 'Mike Bot',
      synopsis: 'First Synopsis',
      cover_img: 'img1',
      publish_date: '01/02/1990',
      created_at: new Date(),
      intro: 'intro1'
    });
    await Summaries.write({
      book_id: 1,
      summary: 'Dumbledore dies.',
      created_at: new Date()
    });
  });

  afterEach(async () => {
    await db.seed.run();
  });
  const event = { sender: { id: 123 } };
  it('Should return an array', async () => {
    const response = await get_started(event);
    expect(Array.isArray(response)).toBe(true);
  });
});


