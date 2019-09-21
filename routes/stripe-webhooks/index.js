const router = require('express').Router();
const Users = require('models/db/users.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const SUCCESS_ENDPOINT_SECRET = process.env.STRIPE_SUCCESS_ENDPOINT_SECRET;
const FAILURE_ENDPOINT_SECRET = process.env.STRIPE_FAILURE_ENDPOINT_SECRET;

router.use((req, res, next)=> {
	let data_stream ='';
    req
    .setEncoding('utf-8')
    .on('data', function(data) {            //each time there is data this is triggered and the data coming in streams is captured
            data_stream += data;
            //console.log('data_stream is', data_stream);
    })
    .on('end', function() {                 //when the stream ends, this is triggered, attach data_stream to req.rawBody
            console.log("Inside END");
            //console.log('data_stream is', data_stream);
        req.rawBody = data_stream;
        next();
    })	
});

router.post('/paymentsuccess', async (req, res) => {
	console.log('req.rawBody.type inside paymentsuccess webhook endpoint:', JSON.parse(req.rawBody).type);
	console.log('req.rawBody.data.object.customer is stripe_customer_id in subscriptions table inside webhook endpoint: ', JSON.parse(req.rawBody).data.object.customer);
			
    const stripe_customer_id = JSON.parse(req.rawBody).data.object.customer;  //id is stripe_customer_id in subscriptions table
    
    let signature = req.headers['stripe-signature'];
    console.log('stripe signature:', signature);
				
    try {
        let evs = await stripe.webhooks.constructEvent(req.rawBody, signature, SUCCESS_ENDPOINT_SECRET);
        console.log('response from stripe signature verification:', evs);
        
        // Send recurring payment status update to database
        const userUpdates = { stripe_subscription_status: 'active' };
        
        const updatedUser = await Users.edit({ stripe_customer_id }, userUpdates);
        console.log('updatedUser: ', updatedUser);
    }
    catch (err) {
        console.log('error in stripe signature verification is', err.message);
        res.sendStatus(400).json({ error: err.message });
    }

    //Return a response to stripe to acknowledge receipt of the webhook event
    res.sendStatus(200);
});

router.post('/paymentfailure', async (req, res)=>{
    console.log('req.rawBody.type inside paymentfailure webhook endpoint:', JSON.parse(req.rawBody).type);
    console.log('req.rawBody.data.object.customer inside webhook endpoint:', JSON.parse(req.rawBody).data.object.customer);

    const stripe_customer_id = await JSON.parse(req.rawBody).data.object.customer;  //id is stripe_customer_id in subscriptions table

    let signature = req.headers['stripe-signature'];
    console.log('stripe signature:', signature);

    try {
        let evs = await stripe.webhooks.constructEvent(req.rawBody, signature, FAILURE_ENDPOINT_SECRET);
        console.log('response from stripe signature verification: ', evs);

        // Send recurring payment failure status update to database
        const userUpdates = { stripe_subscription_status: 'past_due' };
        
        const updatedUser = await Users.edit({ stripe_customer_id }, userUpdates);
        console.log('updatedUser: ', updatedUser);
    }
    catch (err) {
        console.log('error in stripe signature verification: ', err);
        res.sendStatus(400).json({ error: err });
    }

    //Return a response to stripe to acknowledge receipt of the webhook event
    res.sendStatus(200);
});


module.exports = router;