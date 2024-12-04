const catchAsync = require('../../utils/catchAsync');
const Subscription = require('../../models/subscriptionModel');

const createPricingCheckout = catchAsync(async (req, res, next) => {
  try {
    // This is only temporary, because it's UNSECURE: everyone could make subscriptions without paying.
    const { pricingName, pricings, user, price } = req.query;

    if (!pricings && !user && !price) return next();

    await Subscription.create({
      pricings,
      user,
      price,
      pricingName,
      status: 'active',
      autoRenew: true,
    });

    res.redirect(req.originalUrl.split('?')[0]);
  } catch (err) {
    console.log(
      `CREATE PRICING CHECKOUT | PRICING CONTROLLER | ERROR ⭕⭕⭕`,
      err,
    );
    throw err;
  }
});

module.exports = createPricingCheckout;
