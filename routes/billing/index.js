const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const UTILS = require('../utils/format-numbers.js');
const Users = require('models/db/users.js');

// GET endpoint to retrieve all products and plans from Stripe:
router.get('/productsandplans/:id', async (req, res) => {
    const productsFromStripe = await stripe.products.list({});
    const plansFromStripe = await stripe.plans.list({});

    // get data from responses above, which contains array of products/plans:
    let products = productsFromStripe.data;
    let plans = plansFromStripe.data;

    // Get the user's subscripition id if they have one:
    const facebook_id = req.params.id;
    const user = await Users.retrieve({ facebook_id }).first();
    
    // Check if user has subscription id; if they do get the subscription plan id:
    const subID = await user.stripe_subscription_id;
    const subscription = subID ? await stripe.subscriptions.retrieve(subID) : {};
    const currentPlanID = subscription.plan.id;

    // Sort plans in ascending order of price (amount):
    plans = plans.sort((a, b) => {
        return a.amount - b.amount;
    }).map(plan => {
        plan.user_is_subscribed = plan.id === currentPlanID ? true : false;
        // Map to new array with formatted price (amount) for each plan:
        amount = UTILS.formatUSD(plan.amount);
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
    // POSSIBLE TO DO:
        // check if user already has an active subscription
    
    const { facebook_id, source } = req.body;

    // Create a customer with Stripe:
    const customer = await stripe.customers.create({
        source: source           // source is the token.id created at checkout
    });

    // Create a Stripe charge and subscribe customer to the plan they chose:
    const subscription = await stripe.subscriptions.create({
        customer: customer.id,    // comes from create Customer call above
        items: [
            { plan: req.body.planID }
        ]      
    });

    const userUpdates = {
        stripe_customer_id: customer.id,
        stripe_subscription_id: subscription.id,
        stripe_subscription_status: subscription.status
    };

    const updatedUser = await Users.edit({ facebook_id }, userUpdates);

    res.status(201).json('Payment successful. Subscribed to plan.');   
});

router.post('/testuser', async (req, res) => {
    console.log('testuser post endpoint hit');
    const { email, facebook_id } = req.body;
    const user = {
        email,
        facebook_id
    };

    const newUser = await Users.add(user);

    res.status(201).json(newUser);
});

module.exports = router;
