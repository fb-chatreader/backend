const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/productsandplans', async (req, res) => {
    const products = await stripe.products.list({});
    res.status(200).json(products);

});

module.exports = router;
