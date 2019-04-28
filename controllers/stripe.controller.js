'use strict';
const constants = require('../constants');
const stripe = require("stripe")(constants.STRIPE_SECRET_KEY);

class StripeController {

}

StripeController.post("/charge", async (req, res) => {
    try {
        let {status} = await stripe.charges.create({
            amount: 2000,
            currency: "usd",
            description: "An example charge",
            source: req.body
        });

        res.json({status});
    } catch (err) {
        res.status(500).end();
    }
});

module.exports = StripeController;