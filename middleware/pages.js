module.exports = {
  validatePage
};

function validatePage(req, res, next) {
  const { access_token, page_id } = req.body;

  if (!access_token || !page_id) {
    return res.status(400).json({
      message: 'You must include an access token and page ID with this request.'
    });
  }

  next();
}
