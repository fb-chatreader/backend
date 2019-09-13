const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/productsandplans', async (req, res) => {
    const productsFromStripe = await stripe.products.list({});
    const plansFromStripe = await stripe.plans.list({});
    // get data from responses above, which contains array of products/plans:
    const products = productsFromStripe.data;
    const plans = plansFromStripe.data;

    // Sort plans in ascending order of price (amount):
    plans = plans.sort((a, b) => {
        return a.amount - b.amount;
    }).map(plan => {
        // Format plan price (amount)
        amount = UTILS.formatUSD(plan.amount)
        return {...plan, amount};
    });
  
    products.forEach(product => {
        const filteredPlans = plans.filter(plan => {
            return plan.product === product.id;
        });

        product.plans = filteredPlans;
    });

    // res.status(200).json(products);
});

module.exports = router;
