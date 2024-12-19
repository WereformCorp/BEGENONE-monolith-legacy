const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Verifies the Stripe webhook signature
const verifyStripeWebhook = (req, res) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  return event;
};

module.exports = verifyStripeWebhook;
