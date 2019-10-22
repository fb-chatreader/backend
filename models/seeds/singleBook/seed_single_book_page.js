// You can run this file to test a single book page.
// Open your .env and add the SINGLE_BOOK env vars
// Then run this in your terminal:
// npm run seed-single-page

const Pages = require('../../../models/db/pages.js');
const Books = require('../../../models/db/books.js');
const SummaryParts = require('../../../models/db/summaryParts.js');

const { summary, ...book } = require('./book.json');
const getSummaryParts = require('../../../routes/books/helpers/getSummaryParts.js');

return setupSingleBookPage();

async function setupSingleBookPage() {
  const summaries = getSummaryParts(summary);
  const page_id = process.env.SINGLE_BOOK_PAGE_ID;
  const access_token = process.env.SINGLE_BOOK_ACCESS_TOKEN;
  if (!page_id || !access_token) {
    console.error('ERROR: Missing page_id or access_token');
    process.exit();
  }
  // For now, the verification_token has to be unique in the database and not Null
  // However, we don't actually need one, so just adding a character to make it distinct
  const verification_token = process.env.verification_token + '!';

  await Pages.add({
    page_id,
    access_token,
    verification_token
  });

  const { id: book_id } = await Books.add({ ...book, page_id });

  for (let i = 0; i < summaries.length; i++) {
    const summary = summaries[i];
    await SummaryParts.add({ book_id, summary });
  }
  console.log('Single book page setup successfully!');
  process.exit();
}
