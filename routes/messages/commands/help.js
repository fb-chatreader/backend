const Users = require('../../../models/db/users.js');
const getUserInfo = require('../util/asyncFunctions');

module.exports = async event => {
  const user_info = await getUserInfo(event.sender.id);
  const id = 1;
  //   return {
  //     object: 'page',
  //     entry: [
  //       {
  //         id,
  //         time: Date.now(),
  //         messaging: [
  //           {
  //             timestamp: 1502905976377,
  //             message: {
  //               quick_reply: {
  //                 payload: 'help'
  //               },
  //               text: `
  //                       Available Text Input Commands:
  //                       Get started: Start app,
  //                       Synopsis: Quick Synopsis,
  //                       Start Summary: Start Summary from beginning
  //                       Finish: Straight to end of Summary`
  //             }
  //           }
  //         ]
  //       }
  //     ]
  //   };

  return [
    {
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: 'Help',
            // payload: 'help',
            buttons: [
              {
                type: 'postback',
                title: 'Get Started',
                payload: 'get_started'
              },
              {
                type: 'postback',
                title: 'Quick Synopsis',
                payload: 'get_synopsis'
              },
              {
                type: 'postback',
                title: 'Start Summary',
                payload: 'get_summary'
              },
              {
                type: 'postback',
                title: 'Finish',
                payload: 'amazon_link'
              }
            ]
          }
        }
      }
    }
  ];
};

// {
//   text: `
//     Available Text Input Commands:
//     Get started: Start app,
//     Synopsis: Quick Synopsis,
//     Start Summary: Start Summary from beginning
//     Finish: Straight to end of Summary`
// },
// {
//   timestamp: 1458692752478,
//   message: {
//     mid: 'mid.1457764197618:41d102a3e1ae206a38',
//     text: 'hello, world!',
//     quick_reply: {
//       payload: 'help'
//     }
//   }
// }
