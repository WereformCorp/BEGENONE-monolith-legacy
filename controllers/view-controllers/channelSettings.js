/**
 * @fileoverview Channel settings page view renderer
 * @module controllers/view-controllers/channelSettings
 * @layer Controller (View)
 *
 * @description
 * Renders the channel settings management page. Fetches the user's channel and
 * subscription data, resolves CloudFront URLs for channel logo and banner,
 * and checks subscription features to determine channel creation eligibility.
 *
 * @dependencies
 * - Upstream: view route handler (authenticated)
 * - Downstream: User model, Pricing model, catchAsync
 */
const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');
const Pricing = require('../../models/pricingModel');

const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN; // e.g., "https://d12345.cloudfront.net"

const channelSettings = catchAsync(async (req, res, next) => {
  try {
    const userData = await User.findById(res.locals.user._id)
      .populate('channel')
      .populate('currentActiveSubscription');
    const { channel, currentActiveSubscription } = userData;

    console.log(`Current Active Subscription:`, currentActiveSubscription);

    // Map channelLogo and bannerImage fields to CloudFront URLs
    if (channel && channel.channelLogo) {
      channel.channelLogo = `${cloudFrontDomain}/${channel.channelLogo}`; // Save CloudFront URL in profilePicUrl
    }
    if (channel && channel.bannerImage) {
      channel.bannerImage = `${cloudFrontDomain}/${channel.bannerImage}`; // Save CloudFront URL in bannerImageUrl
    }

    let subscriptionFeatures = {};
    let subscriptionStatus = 'inactive';
    let canCreateChannel = false;

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
          `SUBSCRIPTION FEATURES's CHANNEL CREATION:`,
          subscriptionFeatures.channelCreation,
        );
        console.log(`PRICING FEATURES:`, pricing.features);

        canCreateChannel = subscriptionFeatures.get('channelCreation');
      }
    }

    // Prevent access if channel creation is not allowed
    if (!canCreateChannel) {
      canCreateChannel = false;
    } else {
      canCreateChannel = true;
    }

    console.log(`Can or Cannot Create Channel:`, canCreateChannel);
    // let subscriptionActive = false;
    // let subscriptionExist = false;

    // const subscription = await Subscription.findById(
    //   userData.currentActiveSubscription,
    // );

    // if (!subscription) {
    //   console.log(`SUBSCRIPTION NOT FOUND! [ Channel Settings Js ]`);
    // } else {
    //   console.log(`SUBSCRIPTION FROM CHANNEL SETTINGS:`, subscription);

    //   if (subscription) {
    //     if (subscription.pricingName !== 'signup') {
    //       subscriptionActive = true;
    //     }

    //     if (subscription.active === true) {
    //       subscriptionExist = true;
    //     }
    //   }
    // }
    // console.log(`USER FROM VIEWS CONTROLLER:`, res.locals.user);
    console.log(`USERDATA FROM VIEWS CONTROLLER:`, userData);

    res.status(200).render(`../views/settings/channel/channel-settings`, {
      title: `Channel Settings`,
      channel,
      channelLogo: channel ? channel.channelLogo : null,
      bannerImage: channel ? channel.bannerImage : null,
      user: res.locals.user,
      useCustomLeftNav: true,
      userData,
      userDataId: userData._id,
      userActiveStatus: userData.active,
      subscriptionStatus,
      subscriptionFeatures,
      canCreateChannel,
      showAds: res.locals.showAds,
    });
  } catch (err) {
    console.log(`CHANNEL SETTINGS | VIEWS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = channelSettings;
