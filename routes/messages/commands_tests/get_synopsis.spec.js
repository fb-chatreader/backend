const get_synopsis = require('../commands/get_synopsis.js');
const db = require('../../../models/dbConfig.js');
const Books = require('../../../models/db/books.js')


describe('get synopsis command test', () => {
  it('book synopsis should be string', async () => {
    let book = await Books.retrieve()
    expect(typeof 'book.synopsis').toBe('string');
    expect(typeof 'book.title').toBe('string');
    expect (typeof 'book.author').toBe('string');
    expect(typeof 'book.cover_img').toBe('string');
    expect( typeof 'book.intro').toBe('string');
    expect(typeof 'book.publish_date').toBe('string');
    expect (typeof 'book.created_at').toBe('string ');
  });
});