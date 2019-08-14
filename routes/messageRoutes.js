const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const router = express.Router().use(bodyParser.json());
const request = require('request');
const db = require('../models/dbConfig');

const URL = 'http://localhost:8000/api';

function handleMessage(sender_psid, received_message) {
  let response;
  
  // Checks if the message contains text
  if (received_message.text === "get started" || received_message.text === "Get started") {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Continue to book",
            "subtitle": "Tap a button to answer.",
            "buttons": [
              {
                "type": "postback",
                "title": "Continue",
                "payload": "continue",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  } 
  
  // Send the response message
  callSendAPI(sender_psid, response);    
}
function handlePostback(sender_psid, received_postback) {
  let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'continue') {
    // response = 
    // axios
    //   .get(`${URL}/books`)
    //   .then(function(res) {
      response = {
        "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [
                {
                  "title": "Hi [first name], my name is Phil Knight and 'm the founding CEO of Nike. I wanted to share with you a quick preview of my book Shoe Dog",
                  "subtitle": "Tap a button to answer.",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "Next",
                      "payload": "next"
                    }
                  ]
                }
              ]
            }
          }
        };
    //  stage += 1;
  }  else if (payload === 'next') {
    let bookTitle = handleAxiosGet()
    response = {
      "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
              {
                "title": bookTitle,
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Next",
                    "payload": "next"
                  }
                ]
              }
            ]
          }
        }
      };

  } else if (payload === 'no') {
    response = { "text": "Oops try different input" }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

function handleAxiosGet() {
  axios
  .get(`${URL}/books`)
  .then(function(res) {
    const bookTitle = res.data[0].title
    console.log(bookTitle)
  })
  .catch(function(err) {
    console.log(err);
  })
}


router.post('/webhook', (req, res) => {
  let body = req.body;
  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      let webhookEvent = entry.messaging[0];
      console.log(webhookEvent);
      // sender PSID
      let senderPsid = webhookEvent.sender.id;
      // reciever PSID
      let receiverPsid = webhookEvent.recipient.id;

      if (webhookEvent.message) {
        handleMessage(senderPsid, webhookEvent.message);
      } else if (webhookEvent.postback) {
        handlePostback(senderPsid, webhookEvent.postback);
      }
    });
    res.status(200).send('Event received');
  } else {
    res.sendStatus(404);
  }
});

router.get('/webhook', (req, res) => {
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(404);
  }
});

// router.get('/', (req, res) => {
//   res.send('API RUNNING!!!');
//   res.status(200);
// });

//   const PORT = process.env.PORT || 5500;
//   router.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });

module.exports = router;

