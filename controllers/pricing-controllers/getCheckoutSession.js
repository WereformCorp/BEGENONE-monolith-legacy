/**
 * @fileoverview Stripe Checkout Session creation for subscription purchases
 * @module controllers/pricing-controllers/getCheckoutSession
 * @layer Controller
 *
 * @description
 * Creates a Stripe Checkout Session in subscription mode for the selected pricing
 * tier. Looks up the Pricing document by route parameter, constructs a recurring
 * line item with the pricing details, and returns the session object to the client
 * for redirect to Stripe's hosted checkout page.
 *
 * @dependencies
 * - Upstream: pricing route handler (authenticated)
 * - Downstream: Stripe API (stripe.checkout.sessions.create), Pricing model, catchAsync
 *
 * @security
 * Requires STRIPE_SECRET_KEY environment variable. Embeds user email and pricing ID
 * in the session for downstream webhook reconciliation.
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const catchAsync = require('../../utils/catchAsync');
const Pricing = require('../../models/pricingModel');
// const User = require('../../models/userModel');

/**
 * Creates a Stripe Checkout Session for a monthly subscription based on the
 * selected pricing tier. Attaches userId and pricingName as session metadata
 * for reconciliation in the webhook handler.
 * @param {import('express').Request} req - Express request with params.pricingID and authenticated user
 * @param {import('express').Response} res - Express response returning the Stripe session
 * @param {import('express').NextFunction} next - Express next middleware
 */
const getCheckoutSession = catchAsync(async (req, res, next) => {
  try {
    // 1) Get the Currectly Selected Subscription
    const pricing = await Pricing.findById(req.params.pricingID);
    const userId = req.user.id;
    console.log(`USER ID FROM CHECKOUT SESSION 🟩🟩🟩:`, userId);
    const totalPrice = Math.round(Number(pricing.price) * 100);

    console.log(`Total price:`, totalPrice);

    // 2) Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/`,
      cancel_url: `${req.protocol}://${req.get('host')}/`,
      customer_email: req.user.eAddress.email,
      client_reference_id: req.params.pricingID,
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${pricing.name} Subscription`,
              description: pricing.description,
              images: [
                `https://begenone-images.s3.us-east-1.amazonaws.com/begenone-white-transparent-logo-beta-min.png`,
              ],
            },
            // unit_amount: pricing.price * 100, // price in cents
            unit_amount: totalPrice, // price in cents
            recurring: {
              interval: 'month', // Frequency of the subscription (can be 'month', 'year', etc.)
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        pricingName: pricing.name,
        userId, // Store only the pricing name without "Subscription"
      },
    });

    console.log(
      'SESSION FROM GET CHECKOUT SESSION FUNCTION 🟩⭕🟩⭕🟩:',
      session,
    );
    // 3) Create Session as Response
    res.status(200).json({
      status: 'success',
      session,
    });
  } catch (err) {
    console.log(
      `GET CHECKOUT SESSION | PRICING CONTROLLER | ERROR ⭕⭕⭕`,
      err,
    );
    throw err;
  }
});

module.exports = getCheckoutSession;
