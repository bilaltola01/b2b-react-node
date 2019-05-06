'use strict';
const constants = require('../constants');
const stripe = require("stripe")(constants.STRIPE_SECRET_KEY);
const Company = require('../models/company.model');

class StripeController {

}

StripeController.chargeDigitalMenuPlan = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const data = JSON.parse(JSON.stringify(req.body));

    const email = data.email;
    const token = data.stripeToken;

    const trial_period_days = data.trial ? 90 : null;

    Company.customerIDExists(email).then(customerIDExists => {
        if (!customerIDExists) {
            stripe.customers.create({
                    description: 'Customer for ' + email,
                    source: token,
                    email: email
                }, function(err, customer) {
                    if (err) {
                        res.status(204).send({ success: false, message: 'stripe create customer failed', obj: err });
                    }
                    Company.getByEmail(email).then(company => {
                        company.CustomerID = customer.id;
                        Company.update(company.CompanyID, company);
                    })
                }
            );
        }
        Company.getByEmail(email).then(company => {
            stripe.subscriptions.create({
                customer: company.CustomerID,
                items: [
                    {
                        plan: 'digital-menu',
                    },
                ],
                trial_period_days
                }, function(err, subscription) {
                    if (err) {
                        res.status(204).send({ success: false, message: 'digital menu plan failed', obj: err });
                    }
                    res.status(200).json({ success: true, message: 'digital menu plan successfully activated', obj: subscription });
                }
            ); 
        })
        
    })
};

StripeController.getDigitalMenuPlan = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    stripe.plans.retrieve('digital-menu', function(err, plan) {
        if (err) {
            res.status(204).send({ success: false, message: 'digital menu plan get failed', obj: err });
        }
        res.status(200).json({ success: true, message: 'digital menu plan successfully fetched', obj: plan });
    });
}

StripeController.getMultilingualMenuPlans = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const multilingualIDs = ['multilingual-first', 'multilingual-second', 'multilingual-third'];

    let plans = [];

    for (let index=0; index<3; index++) {
        await stripe.plans.retrieve(multilingualIDs[index], function(err, plan) {
            if (plan) {
                plans.push(plan);
            }
            if (index === 2) {
                if (plans.length === 3) {
                    res.status(200).json({ success: true, message: 'digital menu plan successfully fetched', obj: plans });
                } else {
                    res.status(204).send({ success: false, message: 'digital menu plan get failed', obj: "error" });
                }
            }
            
        });
    }
}


module.exports = StripeController;