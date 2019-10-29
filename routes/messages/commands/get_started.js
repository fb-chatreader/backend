const UserCategories = require('models/db/userCategories.js');
const UserLibraries = require('models/db/userLibraries.js');
const Books = require('models/db/books.js');

const getUserInfo = require('../helpers/getUserInfo.js');

module.exports = async function(Event) {
  if (Event.isNewPage()) {
    return [
      {
        text:
          'Sorry, this bot is still being created, please visit us again soon!'
      }
    ];
  }
  return Event.isSingleBookPage()
    ? getSingleBook.call(this, Event)
    : getMultipleBooks.call(this, Event);
};

async function getMultipleBooks(Event) {
  // For now, the bot assumes if there are multiple books, it's on ChatReader
  const { user_id } = Event;

  const userCategories = await UserCategories.retrieve({ user_id });
  const userLibraries = await UserLibraries.retrieve({ user_id });

  const { first_name } = await getUserInfo(Event);

  const introText = `Chatwise summarizes 2000+ popular non-fiction books into chat messages with key insights. Each book is summarized into a 10-15 minute read.`;
  const firstTimeText = `Hi ${first_name}, welcome to Chatwise!\n\nWe summarize 2000+ popular non-fiction books into chat messages with key insights. Each book is summarized into a 10-15 minute read.`;

  const text = userCategories.length === 0 ? firstTimeText : introText;

  const replyOptions = userLibraries.length
    ? [
        {
          title: 'Browse Books',
          command: 'browse'
        },
        {
          title: 'View Library',
          command: 'library'
        },
        {
          title: 'Get Help',
          command: 'help'
        }
      ]
    : [
        {
          title: 'Browse Books',
          command: 'browse'
        },
        {
          title: 'Get Help',
          command: 'help'
        }
      ];

  const quickReplies = replyOptions.map(({ title, command }) => ({
    title,
    payload: JSON.stringify({ command })
  }));

  return this.sendTemplate('QuickReply', text, quickReplies);
}

async function getSingleBook(Event) {
  const book = await Books.retrieve({ 'b.page_id': Event.page_id }).first();
  const userInfo = await getUserInfo(Event);

  const { id: book_id, title, author, synopsis, intro, image_url } = book;

  const text = `Hi, ${userInfo.first_name}! ${intro}`;

  const buttons = [];
  if (synopsis) {
    buttons.push({
      type: 'postback',
      title: 'Quick Synopsis',
      payload: JSON.stringify({
        command: 'get_synopsis',
        book_id
      })
    });
  }

  buttons.push({
    type: 'postback',
    title: 'Start Summary',
    payload: JSON.stringify({
      command: 'get_summary',
      book_id
    })
  });

  return [
    { text },
    this.sendTemplate('Generic', [
      {
        title,
        image_url,
        subtitle: `by ${author}`,
        buttons
      }
    ])
  ];
}
