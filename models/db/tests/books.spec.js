const db = require('../../index.js.js');
const Books = require('../books.jss');

describe('Testing queries in the books.js file', () => {
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

    test('should be the right datatype', async () => {
      const book = await Books.retrieve();
      expect(typeof 'book.author').toBe('string');
      expect(typeof book.author).toBe(string);
    });

    // it('should insert the provided hobbit', async () => {
    //   let hobbit = await Hobbits.insert({ name: 'gaffer' });
    //   expect(hobbit.name).toBe('gaffer');

    //   hobbit = await Hobbits.insert({ name: 'sam' });
    //   expect(hobbit.name).toBe('sam');
    // });
  });
});
