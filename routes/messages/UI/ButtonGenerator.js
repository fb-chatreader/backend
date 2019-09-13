/**
 * Dynamically generates messenger buttons
 * Params:
 * - content: (object) containing Button object values
 */
module.exports = async (content) => {
  const { type, template_type, title, image_url, subtitle, default_action, buttons } = content;
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
