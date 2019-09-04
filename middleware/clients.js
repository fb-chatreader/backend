module.exports = {
  validateClient
};

function validateClient(req, res, next) {
  const client = req.body;

  if (!client || !client.access_token || !client.name) {
    return res.status(400).json({
      message: 'You must include an access token and name with this request.'
    });
  }

  next();
}
