function verifyWebhook({ body }, res, next) {
  if (body.object === 'page') {
    next();
  } else {
    res.sendStatus(404);
  }
}

module.exports = { verifyWebhook };
