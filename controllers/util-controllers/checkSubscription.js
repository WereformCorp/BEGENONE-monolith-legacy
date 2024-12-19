// middlewares/checkSubscription.js
const Subscription = require('../../models/subscriptionModel');
const Pricing = require('../../models/pricingModel');
const User = require('../../models/userModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const checkSubscription = async (req, res, next) => {
  try {
    // Step 1: Get the current user and active subscription
    const user = await User.findById(res.locals.user._id).populate(
      'currentActiveSubscription',
    );
    if (!user || !user.currentActiveSubscription) {
      return res.status(400).json({
        status: 'Failed',
        message: `No active subscription found. Please purchase a subscription to upload videos.`,
      });
    }

    // Step 2: Fetch the subscription associated with the user
    const subscription = await Subscription.findById(
      user.currentActiveSubscription,
    );
    if (!subscription) {
      return res.status(400).json({
        status: 'Failed',
        message: `Subscription associated with user is invalid or not found.`,
      });
    }

    // Step 3: Fetch the pricing details associated with the subscription
    const pricing = await Pricing.findById(subscription.pricings);
    if (!pricing) {
      return res.status(400).json({
        status: 'Failed',
        message: `Pricing details for the subscription are missing.`,
      });
    }

    // Step 4: Check if the subscription is active and if the 'videoUpload' feature is enabled
    if (
      subscription.active ||
      subscription.status === 'active' ||
      pricing.features.get('videoUpload')
    ) {
      // If everything is okay, proceed to the next middleware/controller
      return next();
    }
    // If the user is not eligible
    return res.status(400).json({
      status: 'Failed',
      message: `You cannot upload videos. Please check your subscription.`,
    });
  } catch (err) {
    console.error(`Subscription check failed:`, err);
    return next(new AppError(`Subscription validation failed.`, 500));
  }
};

const checkUserSubscription = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findById(res.locals.user._id).populate(
      'currentActiveSubscription',
    );
    console.log(`USER:`, user);
    if (!user || !user.currentActiveSubscription) {
      res.locals.subscriptionValid = false; // Set a flag indicating subscription is not valid
      res.locals.showAds = true;
      return next();
    }

    const subscription = await Subscription.findById(
      user.currentActiveSubscription,
    );
    console.log(`SUBSCRIPTION ITSELF:`, subscription);

    if (
      !subscription ||
      subscription.active === false ||
      subscription.status !== 'active' ||
      subscription.status === 'inactive'
    ) {
      res.locals.subscriptionValid = false; // Set a flag indicating subscription is not valid
      res.locals.showAds = true;
      return next();
    }

    const pricing = await Pricing.findById(subscription.pricings);
    if (!pricing) {
      res.locals.subscriptionValid = false; // Set a flag indicating subscription doesn't support video upload
      res.locals.showAds = true;
      return next();
    }
    console.log(`PRICING ITSELF:`, pricing);

    res.locals.subscriptionValid = true; // Subscription is valid and can upload videos
    res.locals.showAds = false;
    return next(); // Proceed to the next middleware or handler
  } catch (err) {
    console.error('Subscription check failed:', err);
    return next(new AppError('Subscription validation failed.', 500)); // Send to global error handler
  }
});

module.exports = { checkSubscription, checkUserSubscription };
