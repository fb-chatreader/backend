module.exports = (text, replies) => {
  /*
  "replies" must be an array of objects.  Each object must have a title and payload and optionally an image_url
  [
      {
        "content_type":"text",
        "title":"Red",
        "payload":"<POSTBACK_PAYLOAD>",
        "image_url":"http://example.com/img/red.png"
      },{
        "content_type":"text",
        "title":"Green",
        "payload":"<POSTBACK_PAYLOAD>",
        "image_url":"http://example.com/img/green.png"
      }
    ]
  */

  const quick_replies = replies.map(qr => ({ content_type: 'text', ...qr }));

  return {
    text,
    quick_replies
  };
};
