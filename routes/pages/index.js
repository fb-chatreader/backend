const router = require('express').Router();
const Pages = require('models/db/pages.js');

const { validatePage } = require('middleware/pages.js');

router.post('/add', validatePage, async (req, res) => {
  const { access_token, page_id, isNewApp } = req.body;
  const newPage = await Pages.add({ access_token, page_id, isNewApp });
  if (!isNewApp) {
    delete newPage.verification_token;
  }
  const { id, created_at, access_token: at, ...rest } = newPage;
  return newPage
    ? res.status(201).json(
        isNewApp
          ? {
              callback_URL: `${process.env.APP_URL}/api/messenger`,
              ...rest
            }
          : { message: "You are now live!  Don't forget to add books" }
      )
    : res.sendStatus(418);
});

module.exports = router;
