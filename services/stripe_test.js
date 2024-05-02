import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(
  "sk_test_51NcotDFDslnmTEHTPCFTKNDMtYwf06E9qZ0Ch3rHa8kI6wbx6LPPTuD0qmN3JG2MF9MtoSr8JjmAfwcxNECDaBvZ00yMpBm3f1"
);

export const createPaymentIntent = async (req, res) => {
  const { email, name } = req.body;
  let customer = await stripe.customers.list({ email: email });
  if (customer.data.length > 0) {
    // Customer already exists, retrieve customer details
    customer = customer.data[0];
  } else {
    // Customer doesn't exist, create a new one
    customer = await stripe.customers.create({
      name,
      email: email,
    });
  }
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2023-10-16" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "eur",
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_test_51NcotDFDslnmTEHTC1GIVWyuc6ZGAfhWvQFlyE7v6Pno2VZeZ8gAHlwFPP1Euj5Rqdxyo58LMdOuLTQKIazuD13G00cUhvtJLe",
  });
};
