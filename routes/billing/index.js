const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const UTILS = require('../utils/format-numbers.js');

// GET endpoint to retrieve all products and plans from Stripe:
router.get('/productsandplans', async (req, res) => {
    const productsFromStripe = await stripe.products.list({});
    const plansFromStripe = await stripe.plans.list({});
    // get data from responses above, which contains array of products/plans:
    let products = productsFromStripe.data;
    let plans = plansFromStripe.data;

    // Sort plans in ascending order of price (amount):
    plans = plans.sort((a, b) => {
        return a.amount - b.amount;
    }).map(plan => {
        // Map to new array with formatted price (amount) for each plan:
        amount = UTILS.formatUSD(plan.amount)
        return {...plan, amount};
    });
  
    // Attach each plan to its corresponding product:
    products.forEach(product => {
        const filteredPlans = plans.filter(plan => {
            return plan.product === product.id;
        });

        product.plans = filteredPlans;
    });

    res.status(201).json(products);
});

// POST endpoint to create a new subscription when a customer completes checkout:
router.post('/checkout/newsub', async (req, res) => {
    // TO DO:
        // check if user already has an active subscription
    
    // Create a customer with Stripe:
    const customer = await stripe.customers.create({
        source: req.body.source,            // source is the token.id created at checkout
    });
    // console.log('Stripe charge response:', charge);

    // Create a Stripe charge and subscribe customer to the plan they chose:
    const charge = await stripe.subscriptions.create({
        customer: customer.id,    // comes from creatCustomer call above
        items: [
            { plan: req.body.planID }
        ]      
    });
    // console.log('Stripe charge response:', charge);

    res.status(201).json('Payment successful. Subscribed to plan.')   
});

module.exports = router;
