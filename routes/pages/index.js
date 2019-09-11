const router = require('express').Router();
const Pages = require('models/db/pages.js');

const { validatePage } = require('middleware/pages.js');

router.post('/add', validatePage, async (req, res) => {
  const { access_token, page_id: id } = req.body;
  const newPage = await Pages.add({ access_token, id });

  return newPage
    ? res.status(200).json({
        callback_URL: `${process.env.APP_URL}/api/messenger`,
        verification_token: newPage.verification_token
      })
    : res.sendStatus(418);
});

module.exports = router;
