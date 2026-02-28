/**
 * @fileoverview Stripe webhook signature verification utility
 * @module controllers/util-controllers/verifyStripeWebhook
 * @layer Utility
 *
 * @description
 * Verifies the authenticity of incoming Stripe webhook events by validating
 * the stripe-signature header against the raw request body using the
 * configured STRIPE_WEBHOOK_SECRET. Returns the constructed event on success
 * or responds with 400 if signature verification fails.
 *
 * @dependencies
 * - Upstream: Stripe webhook route handler
 * - Downstream: stripe SDK
 *
 * @security Validates HMAC signature to prevent forged webhook payloads.
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Constructs and verifies a Stripe webhook event from the raw request body.
 * @param {Object} req - Express request; expects raw body and stripe-signature header
 * @param {Object} res - Express response; used to return 400 on verification failure
 * @returns {Object} Verified Stripe event object
 */
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
