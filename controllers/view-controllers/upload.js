const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');
const Pricing = require('../../models/pricingModel');

const upload = catchAsync(async (req, res, next) => {
  try {
    const userData = await User.findById(res.locals.user._id)
      .populate('channel')
      .populate('currentActiveSubscription');

    const subscriptionActivityStatus = res.locals.subscriptionValid;
    console.log(`SUBSCRIPTION STATUS:`, subscriptionActivityStatus);

    console.log(`USER DATA FROM THE UPLOAD FILES:`, userData.active);

    // const { subscriptionStatus } = req;
    // const { subscriptionMessage } = req;

    // console.log(`SUBSCRIPTION STATUS:`, subscriptionStatus);
    // console.log(`SUBSCRIPTION STATUS:`, subscriptionMessage);

    const { currentActiveSubscription } = userData;

    let subscriptionFeatures = {};
    let subscriptionStatus = 'inactive';
    let canUpload = false;

    // Check if the user has an active subscription
    if (currentActiveSubscription && currentActiveSubscription.active) {
      subscriptionStatus = currentActiveSubscription.status;

      // Fetch the pricing model associated with the subscription
      const pricing = await Pricing.findById(
        currentActiveSubscription.pricings,
      );

      if (pricing) {
        subscriptionFeatures = pricing.features;

        console.log(`SUBSCRIPTION FEATURES:`, subscriptionFeatures);
        console.log(
          `SUBSCRIPTION FEATURES's VIDEO UPLOAD:`,
          subscriptionFeatures.get('videoUpload'),
        );

        // Check if video upload is allowed
        canUpload = subscriptionFeatures.get('videoUpload') || false;
      }
    }

    console.log(`Can or Cannot Upload:`, canUpload);

    res.status(200).render(`../views/settings/channel/uploads/_uploads`, {
      title: 'USER PROFILE',
      useCustomLeftNav: true,
      userData,
      userActiveStatus: userData.active,
      subscriptionStatus,
      subscriptionActivityStatus,
      canUpload,
      // showAds: res.locals.showAds || null,
      // subscriptionStatus, // Pass these to the view
      // subscriptionMessage, // Pass these to the view
    });
  } catch (err) {
    console.log(`UPLOAD | Views Controller | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = upload;
