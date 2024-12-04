const catchAsync = require('../../utils/catchAsync');
const Pricing = require('../../models/pricingModel');

const getPricings = catchAsync(async (req, res, next) => {
  try {
    const pricings = await Pricing.find();

    return res.json({
      pricings,
    });
  } catch (err) {
    console.log(`GET PRICING | PRICING CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getPricings;
