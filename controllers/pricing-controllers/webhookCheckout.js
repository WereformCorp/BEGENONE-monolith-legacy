/**
 * @fileoverview Stripe webhook event handler for subscription lifecycle management
 * @module controllers/pricing-controllers/webhookCheckout
 * @layer Controller
 *
 * @description
 * Receives and processes Stripe webhook events. Verifies the webhook signature
 * against STRIPE_WEBHOOK_SECRET to ensure event authenticity. Handles two primary
 * event types: checkout.session.completed (provisions a new subscription, deactivates
 * any prior active subscription, and links the subscription to the user) and
 * customer.subscription.updated (handles cancellation by marking the subscription
 * as inactive).
 *
 * @dependencies
 * - Upstream: Express raw body route (Stripe webhook endpoint)
 * - Downstream: Stripe API (signature verification), Subscription model, User model,
 *   subscriptionHandler, updateSubscriptionStatus, winstonLogger
 *
 * @security
 * Validates Stripe webhook signature before processing any event data.
 * Requires STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET environment variables.
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catchAsync = require('../../utils/catchAsync');
const Subscription = require('../../models/subscriptionModel');
const applySubscription = require('../util-controllers/subscriptionHandler');
const { logInfo, logError } = require('../util-controllers/winstonLogger');
const User = require('../../models/userModel');
const updateSubscriptionStatus = require('../util-controllers/updateSubscriptionStatus');

/**
 * Marks a subscription as inactive in the database following a Stripe cancellation event.
 * Locates the subscription by its Stripe ID, sets status to inactive, disables auto-renew,
 * and records the current timestamp as the end date.
 * @param {Object} subscriptionData - Stripe subscription object from the webhook event
 */
const deleteSubscriptionStatus = catchAsync(async (subscriptionData) => {
  try {
    console.log('Updating subscription for:', subscriptionData);
    const subscriptionId = subscriptionData.id; // Stripe's subscription ID
    console.log(
      `SUBSCRIPTION ID FROM DELETE_SUBSCRIPTION_STATUS`,
      subscriptionId,
    );

    const { status } = subscriptionData;
    console.log(`STATUS FROM DELETE_SUBSCRIPTION_STATUS`, status);

    // Ensure that expires_at exists
    const validUntil = subscriptionData.expires_at
      ? new Date(subscriptionData.expires_at * 1000)
      : null;
    console.log(`VALID_UNTIL FROM DELETE_SUBSCRIPTION_STATUS`, validUntil);

    // Find the subscription using the correct field, e.g., stripeId
    const subscription = await Subscription.findOne({
      stripeId: subscriptionId,
    });
    console.log(`SUBSCRIPTION FROM DELETE_SUBSCRIPTION_STATUS`, subscription);

    if (!subscription) throw new Error('Subscription not found in database');

    // Handle subscription status based on the received event
    if (
      status === 'canceled' ||
      status === 'active' ||
      subscription.active === true
    ) {
      subscription.status = 'inactive';
      subscription.active = false;
      subscription.endDate = new Date(); // Mark as ended
      subscription.autoRenew = false;
      console.log('Subscription marked as inactive:', subscription);
    } else {
      console.log(`Unhandled subscription status: ${status}`);
    }

    await subscription.save(); // Save the updated subscription

    console.log('Subscription updated successfully:', subscription);
  } catch (error) {
    console.error('Error in deleteSubscriptionStatus:', error.message);
    throw new Error('Subscription status update failed');
  }
});

/**
 * Provisions a new subscription after a successful Stripe checkout session.
 * Deactivates any existing active subscription for the user, creates a new
 * Subscription document with active status, links it to the User document,
 * and delegates to applySubscription for feature enablement.
 * @param {Object} session - Stripe checkout.session.completed event data object
 */
const createBookingCheckout = catchAsync(async (session) => {
  // 1) If User Purchaases A Subscription, a New Subscription is created.
  // 2) The new created subscription gets added to the user's subscription field and currectActiveSubscription Field and all previous subscriptions remain in the same subscruption field and not get removed.
  // 4) Make CurrentActiveSubscription set to false.
  // 5) If CurrentActiveSubscription exists then, Make CurrentActiveSubscription's TODO: "ACITVE" set to false.
  // 6) If CurrentActiveSubscription exists then, Make CurrentActiveSubscription's Status to 'Inactive'.
  // 7) If CurrentActiveSubscription exists then, Make EndDate to Date.now() so it's right away.
  // 8) Save the document.
  // 9) Set the push the newly created Subscription inside the UserData's Subscription and also add the id of that new subscription inside CurrentActiveSubscription.
  // 10) Save the UserData document.

  // console.log('CREATE BOOKING CHECKOUT SESSION:', session);

  const pricingId = session.client_reference_id;
  const { userId, pricingName } = session.metadata;
  const currentPeriodEndTimestamp = session.expires_at;
  // const price = session.amount_total / 100;

  // console.log('expires_at:', session.expires_at);

  // eslint-disable-next-line no-restricted-globals
  if (!currentPeriodEndTimestamp || isNaN(currentPeriodEndTimestamp)) {
    throw new Error('Invalid or missing expires_at in session');
  }

  const endDate = new Date(currentPeriodEndTimestamp * 1000);
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(endDate.getTime())) {
    throw new Error('Failed to convert expires_at to a valid Date');
  }

  const subscriptionId = session.subscription;

  // 2) Check if the user has an existing active subscription to deactivate
  const existingActiveSubscription = await Subscription.findOne({
    user: userId,
    active: true,
  });

  // 3) Deactivate the current active subscription if it exists
  if (existingActiveSubscription) {
    await updateSubscriptionStatus(
      existingActiveSubscription.stripeId,
      'inactive',
      false,
      endDate,
    );
  }

  // const subscription = await Subscription.create({
  //   user: userId,
  //   pricingName,
  //   pricings: pricingId,
  //   stripeId: subscriptionId,
  //   status: 'active',
  //   autoRenew: true,
  //   active: true,
  //   endDate,
  // });

  // 4) Create a new subscription
  const newSubscription = await Subscription.create({
    user: userId,
    pricingName,
    pricings: pricingId,
    stripeId: subscriptionId,
    status: 'active',
    autoRenew: true,
    active: true,
    endDate,
  });

  // 5) Update the user's document with the new subscription
  await User.findByIdAndUpdate(
    userId,
    {
      $push: { subscriptions: newSubscription._id },
      $set: { currentActiveSubscription: newSubscription._id },
    },
    { new: true },
  );

  console.log(`SUBSCRIPTION FROM WEBHOOK CHECKOUT`, newSubscription);

  applySubscription(newSubscription);
});

/**
 * Receives Stripe webhook events, verifies the signature, and dispatches to the
 * appropriate handler based on event type. Returns 200 on success, 400 on
 * signature failure, or 500 on internal processing errors.
 * @param {import('express').Request} req - Express request with raw body and stripe-signature header
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next middleware
 */
const webhookCheckout = catchAsync(async (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    const eventType = event.type;
    const eventData = event.data.object;

    console.log('Webhook Event Received:', eventType, eventData);
    // console.log(`EVENT DATA OBJECT FROM WEBHOOK CHECKOUT:`, eventData);

    /////////////////////////////////////////////////
    if (eventType === 'checkout.session.completed') {
      try {
        // logInfo, logError;
        logInfo('Checkout session completed', event.data.object);
        await createBookingCheckout(eventData);
      } catch (error) {
        logError('Error in createBookingCheckout:', error.message);
        return res.status(500).send('Internal Server Error');
      }
    }

    if (eventType === 'customer.subscription.updated') {
      const subscriptionData = event.data.object;

      // Check if the subscription is canceled
      if (
        subscriptionData.status === 'canceled' ||
        subscriptionData.canceled_at
      ) {
        console.log(
          'Subscription canceled, performing cancellation-specific action...',
        );

        // Optionally, check if the cancellation is at the end of the period
        if (subscriptionData.cancel_at_period_end) {
          console.log(
            'Subscription will cancel at the end of the current period',
          );
        }

        // Handle cancellation logic here
        await deleteSubscriptionStatus(subscriptionData); // Example function
      } else {
        console.log('Subscription is not canceled. No action required.');
      }
    }

    // if (eventType === 'customer.subscription.updated') {
    //   try {
    //     await updateSubscriptionStatus(eventData);
    //   } catch (error) {
    //     console.error('Error in handleSubscriptionUpdate:', error.message);
    //     return res.status(500).send('Internal Server Error');
    //   }
    // }

    res.status(200).json({ recieved: true });
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send('Webhook signature verification failed.');
  }
});

module.exports = webhookCheckout;
