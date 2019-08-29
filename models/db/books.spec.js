const db = require('../dbConfig.js');
const Books = require('./books.js');
const knex = require('knex');

const tables = [
  'violations',
  'timed_messages',
  'chat_reads',
  'summary_parts',
  'books',
  'users'
];
describe('books model', () => {
  beforeEach(async () => {
    await db.seed.run();
  });

  describe('write()', () => {
    const book1 = {
      title: 'First Book',
      author: 'Mike Bot',
      synopsis: 'First Synopsis',
      cover_img: 'img1',
      publish_date: '01/02/1990',
      created_at: new Date(),
      intro: 'intro1'
    };
    const book2 = {
      title: 'Second Book',
      author: 'Joe Comp',
      synopsis: 'Second Synopsis',
      cover_img: 'img2',
      publish_date: '01/02/1990',
      created_at: new Date(),
      intro: 'intro2'
    };
    const book3 = {
      title: 'Third Book',
      author: 'Danielle Cal',
      synopsis: 'Third Synopsis',
      cover_img: 'img3',
      publish_date: '01/02/1990',
      created_at: new Date(),
      intro: 'intro3'
    };
    it('should insert the provided books', async () => {
      await Books.write(book2);
      await Books.write(book3);
      await Books.write(book1);

      const books = await Books.retrieve();
      expect(books).toHaveLength(3);
    });

    // it('should insert the provided hobbit', async () => {
    //   let hobbit = await Hobbits.insert({ name: 'gaffer' });
    //   expect(hobbit.name).toBe('gaffer');

    //   hobbit = await Hobbits.insert({ name: 'sam' });
    //   expect(hobbit.name).toBe('sam');
    // });
  });
});