const get_started = require('./get_started.js');
const Books = require('models/db/books.js');
const QuickReplyTemplate = require('../UI/QuickReplyTemplate.js');

module.exports = async event => {
  const books = await Books.retrieve({ 'b.page_id': event.page.id });

  // This command is only useful for pages with multiple books
  // So handle the cases first where the page is not multi-book
  if (!books.length) {
    return [
      { text: "Sorry, we're still setting this page up, try again soon!" }
    ];
  } else if (books.length === 1) {
    return get_started(event);
  }

  const options = [
    {
      command: 'Get Started',
      description: 'Get starting options',
      title: 'Get Started'
    },
    {
      command: 'Browse',
      description: 'Show book recommendations',
      title: 'Browse Books'
    },
    {
      command: 'Library',
      description: "View books you've saved",
      title: 'View Library'
    }
  ];

  let text = 'Here are some commands you can use to navigate around!';

  const quickReplies = [];

  options.forEach((o, i) => {
    const { title, command } = o;

    quickReplies.push({
      title,
      payload: JSON.stringify({ command: command.toLowerCase() })
    });
  });

  return [QuickReplyTemplate(text, quickReplies)];
};
