const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const router = express.Router().use(bodyParser.json());
const request = require('request');
const db = require('../models/dbConfig');

const URL = 'http://localhost:8000/api';

function handleMessage(senderPsid, receivedMessage) {
  let response;
  // Checks if the message contains text
  const userText = receivedMessage.text;

  if (userText === 'get started') {
    response = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: `get started`,
              subtitle: 'Tap a button to answer.',
              buttons: [
                {
                  type: 'postback',
                  title: 'Continue',
                  payload: 'start'
                }
              ]
            }
          ]
        }
      }
    };
    handlePostback(senderPsid, response);
    console.log('format response', response);
    // console.log(attachmentUrl)

// axios
//   .get(`${URL}/books`)
//   .then(function(res) {
//     const getStartedURL =
//     'https://graph.facebook.com/v2.6/me/messenger_profile?access_token=';
//     response = {
//       attachment: {
//         type: 'template',
//         payload: {
//           template_type: 'generic',
//           elements: [
//             {
//               title: `get started`,
//               subtitle: 'Tap a button to answer.',
//               buttons: [
//                 {
//                   type: 'postback',
//                   title: 'Continue',
//                   payload: 'start'
//                 }
//               ]
//             }
//           ]
//         }
//       }
//     };
//     handlePostback(senderPsid, response);
//     console.log('format response', response);
//     // console.log(attachmentUrl)
//   })
//   .catch(function(err) {
//     console.log(err);
//   });
    

  }

  if (userText === 'book') {
    axios
      .get(`${URL}/books`)
      .then(function(res) {
        response = { text: res.data };
        // {
        //   attachment: {
        //     type: "template",
        //     payload: {
        //       template_type: "generic",
        //       elements: [
        //         {
        //           title: "Is this the right picture?",
        //           subtitle: "Tap a button to answer.",
        //           image_url: attachmentUrl,
        //           buttons: [
        //             {
        //               type: "postback",
        //               title: "Yes!",
        //               payload: "yes"
        //             },
        //             {
        //               type: "postback",
        //               title: "No!",
        //               payload: "no"
        //             }
        //           ]
        //         }
        //       ]
        //     }
        //   }
        // };
        console.log('format response', response);
        // console.log(attachmentUrl)
      })
      .catch(function(err) {
        console.log(err);
      });
  } else if (receivedMessage.attachments) {
    // Get the URL of the message attachment edge case if user puts attachment
    let attachmentUrl = receivedMessage.attachments[0].payload.url;
    response = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: `Sorry can't receive attachments at this time. Please select valid input`,
              subtitle: 'Tap a button to answer.',
              image_url: attachmentUrl,
              buttons: [
                {
                  type: 'postback',
                  title: 'Continue',
                  payload: 'continue'
                },
                {
                  type: 'postback',
                  title: 'Next',
                  payload: 'next'
                }
              ]
            }
          ]
        }
      }
    };
  }
  // Send the response message
  callSendAPI(senderPsid, response);
}

function handlePostback(senderPsid, receivedPostback) {
  let response;
  console.log('inHandlePostback');
  let payload = receivedPostback.payload;
  if (payload === 'yes') {
    response = { text: 'Thanks!' };
  } else if (payload === 'no') {
    response = { text: 'Oops, try sending another image.' };
  }
  callSendAPI(senderPsid, response);
}

function callSendAPI(senderPsid, response) {
  let requestBody = {
    recipient: {
      id: senderPsid
    },
    message: response
  };

  request(
    {
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: process.env.ACCESS_TOKEN },
      method: 'POST',
      json: requestBody
    },
    (err, res, body) => {
      if (!err) {
        console.log('message sent');
      } else {
        console.error('unable to send message' + err);
      }
    }
  );
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

router.get('/', (req, res) => {
  res.send('API RUNNING!!!');
  res.status(200);
});

//   const PORT = process.env.PORT || 5500;
//   router.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });

module.exports = router;

