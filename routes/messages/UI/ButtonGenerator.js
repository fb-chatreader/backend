/**
 * Dynamically generates messenger buttons
 * Params:
 * - content: (object) containing:
 * {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"Welcome!",
            "image_url":"https://petersfancybrownhats.com/company_image.png",
            "subtitle":"We have the right hat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://petersfancybrownhats.com/view?item=103",
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://petersfancybrownhats.com",
                "title":"View Website"
              },{
                "type":"postback",
                "title":"Start Chatting",
                "payload":"DEVELOPER_DEFINED_PAYLOAD"
              }              
            ]      
          }
        ]
      }
    }
  }
 */
module.exports = async (content) => {
  const { type, payload, template_type, elements, title, image_url, subtitle, default_action, buttons } = content;
  const { da_type, da_url, webview_height_ratio } = default_action;

  return {
    attachment: {
      type: type,
      payload: {
        template_type: template_type,
        elements: [
          {
            title: title,
            image_url: image_url,
            subtitle: subtitle,
            default_action: {
              type: da_type,
              url: da_url,
              webview_height_ratio: webview_height_ratio
            },
            buttons: generateButtons(buttons)
          }
        ]
      }
    }
  };
};

const generateButtons = function(btnArr) {
  return btnArr.map((e, i) => {
    return {
      type: e.type,
      url: e.url,
      title: e.title
    };
  });
};
