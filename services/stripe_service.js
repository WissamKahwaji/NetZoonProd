import Stripe from "stripe";
import dotenv from 'dotenv';

// pages/api/stripe/account/index.js
// const stripe = require("stripe")(process.env.STRIPE_API_SECRET)
dotenv.config();

const host = process.env.NEXT_PUBLIC_HOST

const stripe = new Stripe(process.env.STRIPE_API_SECRET);


// export const createCustomer = async (params, callback) => {
//     try {
//         const customer = await stripe.customers.create({
//             name: params.name,
//             email: params.email
//         });
//         callback(null, customer);
//     } catch (error) {
//         return callback(error);
//     }
// }

// export const addCard = async (params, callback) => {

//     try {
//         const card_token = await stripe.tokens.create({
//             card: {
//                 name: params.card_Name,
//                 number: params.card_Number,
//                 exp_month: params.card_ExpMonth,
//                 exp_year: params.card_ExpYear,
//                 cvc: params.card_CVC,
//             }
//         });
//         const card = await stripe.customers.createSourse(params.customer_Id, {
//             source: `${card_token.id}`
//         });

//         callback(null, { card: card.id })

//     } catch (error) {
//         return callback(error);
//     }
// }

// export const generatePaymentIntent = async (params, callback) => {
//     try {
//         const createPaymentIntent = await stripe.paymentIntents.create({
//             receipt_email: params.receipt_email,
//             amount: params.amount * 100,
//             currency: process.env.CURRENCY,
//             payment_method: params.card_id,
//             customer: params.customer_id,
//             payment_method_types: ['card']
//         });
//         callback(null, createPaymentIntent);
//     } catch (error) {
//         return callback(error);
//     }
// }

export const createCustomer = async (params) => {
    try {
        const customer = await stripe.customers.create({
            name: params.name,
            email: params.email
        });
        return customer;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const addCard = async (params) => {
    try {
        console.log('create card token>>>');
        // const card_token = await stripe.tokens.create({
        //     card: {
        //         number: '411111111111', // Use a Stripe test card number
        //         exp_month: 12,
        //         exp_year: 2024,
        //         cvc: '123',
        //     }
        // });
        const card_token = await stripe.tokens.create({
            card: {
                number: '4242424242424242',
                exp_month: 9,
                exp_year: 2024,
                cvc: '314',
            },
        });
        console.log('create card token done');


        console.log('create source');
        const card = await stripe.customers.createSource(params.customer_Id, {
            source: card_token.id
        });

        return { card: card.id };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const generatePaymentIntent = async (params) => {
    try {
        // const createPaymentIntent = await stripe.paymentIntents.create({
        //     receipt_email: params.receipt_email,
        //     amount: params.amount * 100,
        //     currency: process.env.CURRENCY,
        //     payment_method: params.card_id,
        //     customer: params.customer_id,
        //     payment_method_types: ['card']
        // });
        const createPaymentIntent = await stripe.paymentIntents.create({
            amount: 200000,
            currency: process.env.CURRENCY,
            customer: params.customer_id,
            payment_method_types: ['card'],
            // automatic_payment_methods: { enabled: true },
            payment_method: params.card_id,
        });
        return createPaymentIntent;
    } catch (error) {
        throw error;
    }
}


export const stripeAccount = async (req, res) => {
    try {
        const { method } = req
        if (method === "GET") {
            // CREATE CONNECTED ACCOUNT
            const { mobile } = req.query
            const account = await stripe.accounts.create({
                type: "express",
            })
            const accountLinks = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: `${host}/api/stripe/account/reauth?account_id=${account.id}`,
                return_url: `${host}/register${mobile ? "-mobile" : ""}?account_id=${account.id
                    }&result=success`,
                type: "account_onboarding",
            })
            if (mobile) {
                // In case of request generated from the flutter app, return a json response
                res.status(200).json({ success: true, url: accountLinks.url })
            }
            else {
                // In case of request generated from the web app, redirect
                res.redirect(accountLinks.url)
            }
        }
        else if (method === "DELETE") { } else if (method === "POST") { }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

