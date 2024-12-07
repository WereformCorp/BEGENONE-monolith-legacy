const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catchAsync = require('../../utils/catchAsync');
const Subscription = require('../../models/subscriptionModel');
const applySubscription = require('../util-controllers/subscriptionHandler');
// const User = require('../../models/userModel');

const createBookingCheckout = catchAsync(async (session) => {
  console.log('CREATE BOOKING CHECKOUT SESSION:', session);

  const pricingId = session.client_reference_id;

  const { userId } = session.metadata;
  const price = session.amount_total / 100;
  const { pricingName } = session.metadata;
  const subscription = await Subscription.create({
    user: userId,
    pricingName,
    pricings: pricingId,
    price,
    status: 'active',
    autoRenew: true,
  });

  console.log(`SUBSCRIPTION FROM WEBHOOK CHECKOUT`, subscription);

  // const subscriptionData = subscription;

  applySubscription(subscription);
});

const webhookCheckout = catchAsync(async (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // console.log(`EVENT DATA 🟩 🟩 🟩:`, event);

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ recieved: true });
});

module.exports = webhookCheckout;
