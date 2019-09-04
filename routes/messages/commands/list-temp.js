const Command = require('../classes/Command.js');
const ChatReads = require('../../../models/db/chatReads.js');
const Books = require('../../../models/db/books.js');

module.exports = async event => {

    const books = await Books.retrieve();
    "payload" = {
        "template_type": "list",
        "top_element_style": "<LARGE | COMPACT>",
        "elements": [
          {
            "title": "Testing List",
            "subtitle": "List Test",
            "image_url": books[0].cover_img,          
            "buttons": [
                {
                  type: 'postback',
                  title: 'Start Summary',
                  payload: JSON.stringify({
                    command: 'get_summary',
                    book_id: id
                  })
                }
              ],
            "default_action": {
              "type": "web_url",
              "messenger_extensions": FALSE,
              "webview_height_ratio": "TALL "
            }
          },
          
        ],
         "buttons": [
            {
              type: 'postback',
              title: 'Start Summary',
              payload: JSON.stringify({
                command: 'get_summary',
                book_id: id
              })
            },
            {
              type: 'postback',
              title: 'Start Summary',
              payload: JSON.stringify({
                command: 'get_summary',
                book_id: id
              })
            },
            {
              type: 'postback',
              title: 'Start Summary',
              payload: JSON.stringify({
                command: 'get_summary',
                book_id: id
              })
            },
          ]
      }
}