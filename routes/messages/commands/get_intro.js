const ChatReads = require('../../../models/db/chatReads.js');
const Books = require('../../../models/db/books.js');
const Users = require('../../../models/db/users.js');
const request = require('request');
const axios = require('axios');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;



module.exports = async event => {
    const user = await Users.retrieveOrCreate({ facebook_id: event.sender.id });


  /* HARD CODED */
const book_id = 1;
const book = await Books.retrieve({ id: book_id }).first();

await ChatReads.editOrCreate(
    { user_id: user.id, book_id },
    { current_summary_id: 1 }
);

async function getFirst(PSID) {
    try {
    const userInfo = await axios
    .get(`https://graph.facebook.com/${PSID}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`)
        return userInfo.data
    } catch (error) {
        console.log(error)
    }
}

let userInfo = await getFirst(event.sender.id);
    const book_intro = userInfo ?
    `Hi, ${userInfo.first_name}! ${book.intro}` :
    book_intro;

    return {
    attachment: {
        type: 'template',
        payload: {
        template_type: 'button',
        text: book_intro ? book_intro : book.title,
        buttons:
            [
                {
                    type: 'postback',
                    title: 'Welcome',
                    payload: 'get_started'
                }
            ]
            }
        }
    }
};