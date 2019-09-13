const get_started = require('./get_started.js');
const Books = require('models/db/books.js');

module.exports = async event => {
  const books = await Books.retrieve({ page_id: event.page.id });

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
  const buttons = [];

  options.forEach((o, i) => {
    const { title, command, description } = o;
    const space = i > 0 ? '\n' : '\n\n';
    text += `${space}*${command}*: ${description}`;

    buttons.push({
      type: 'postback',
      title,
      payload: JSON.stringify({ command: command.toLowerCase() })
    });
  });

  return [
    {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text,
          buttons
        }
      }
    }
  ];
};
