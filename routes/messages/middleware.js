// IIFE to log enforcement issues
const verifyWebhook = (enforcement => ({ body }, res, next) => {
  try {
    // Temporary measure to notice enforcement issues while I build a
    // more long term solution
    if (enforcement.length) {
      enforcement.forEach(notice =>
        console.error(
          'ENFORCEMENT NOTICE: ',
          notice.action,
          ' - ',
          notice.reason
        )
      );
    }
    if (body.object === 'page') {
      if (body.entry[0].messaging[0]) {
        next();
      } else if (body.entry['policy-enforcement']) {
        enforcement.push(body.entry['policy-enforcement']);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log('Webhook middleware error: ', err, body.entry);
  }
})([]);

module.exports = { verifyWebhook };
