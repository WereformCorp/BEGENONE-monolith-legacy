/**
 * @fileoverview Post-checkout subscription provisioning (deprecated/commented out)
 * @module controllers/pricing-controllers/createPricingCheckout
 * @layer Controller
 *
 * @description
 * Originally handled subscription creation via query-string parameters after a
 * successful Stripe checkout redirect. This approach was replaced by the secure
 * webhook-based flow in webhookCheckout.js. The implementation is fully commented
 * out and retained for historical reference.
 *
 * @dependencies
 * - Upstream: pricing route handler (redirect callback)
 * - Downstream: Subscription model, catchAsync
 */
// const catchAsync = require('../../utils/catchAsync');
// const Subscription = require('../../models/subscriptionModel');

// const createPricingCheckout = catchAsync(async (req, res, next) => {
//   try {
//     // This is only temporary, because it's UNSECURE: everyone could make subscriptions without paying.
//     const { pricingName, pricings, user, price } = req.query;

//     if (!pricings && !user && !price) return next();

//     await Subscription.create({
//       pricings,
//       user,
//       price,
//       pricingName,
//       status: 'active',
//       autoRenew: true,
//     });

//     res.redirect(req.originalUrl.split('?')[0]);
//   } catch (err) {
//     console.log(
//       `CREATE PRICING CHECKOUT | PRICING CONTROLLER | ERROR ⭕⭕⭕`,
//       err,
//     );
//     throw err;
//   }
// });

// module.exports = createPricingCheckout;
