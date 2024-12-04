// /* eslint-disable import/no-extraneous-dependencies */
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// const catchAsync = require('../utils/catchAsync');
// const Pricing = require('../models/pricingModel');
// const Subscription = require('../models/subscriptionModel');

// exports.getPricings = catchAsync(async (req, res, next) => {
//   const pricings = await Pricing.find();

//   return res.json({
//     pricings,
//   });
// });

// exports.getCheckoutSession = catchAsync(async (req, res, next) => {
//   // 1) Get the Currectly Selected Subscription
//   const pricing = await Pricing.findById(req.params.pricingID);
//   // console.log(`pricing:`, pricing);
//   // 2) Create a Checkout Session
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     success_url: `${req.protocol}://${req.get('host')}/?pricings=${req.params.pricingID}&user=${req.user.id}&price=${pricing.price}&pricingName=${pricing.name}`,
//     cancel_url: `${req.protocol}://${req.get('host')}/`,
//     customer_email: req.user.eAddress.email,
//     client_reference_id: req.params.pricingID,
//     mode: 'subscription',
//     line_items: [
//       {
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: `${pricing.name} Subscription`,
//             description: pricing.description,
//             images: [
//               `https://begenone-images.s3.us-east-1.amazonaws.com/begenone-white-transparent-logo-beta-min.png`,
//             ],
//           },
//           // unit_amount: pricing.price * 100, // price in cents
//           unit_amount: Math.round(Number(pricing.price) * 100), // price in cents
//           recurring: {
//             interval: 'month', // Frequency of the subscription (can be 'month', 'year', etc.)
//           },
//         },
//         quantity: 1,
//       },
//     ],
//   });
//   // 3) Create Session as Response
//   res.status(200).json({
//     status: 'success',
//     session,
//   });
// });

// exports.createPricingCheckout = catchAsync(async (req, res, next) => {
//   // This is only temporary, because it's UNSECURE: everyone could make subscriptions without paying.
//   const { pricingName, pricings, user, price } = req.query;

//   if (!pricings && !user && !price) return next();

//   await Subscription.create({
//     pricings,
//     user,
//     price,
//     pricingName,
//     status: 'active',
//     autoRenew: true,
//   });

//   res.redirect(req.originalUrl.split('?')[0]);
// });
