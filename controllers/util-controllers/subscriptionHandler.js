// THIS FILE HANDLES WHAT HAPPENS AFTER A CERTAIN SUBSCRIPTION IS SUCCESSFULL
// const axios = require('axios');

const User = require('../../models/userModel');
const Subscription = require('../../models/subscriptionModel');
// const Channel = require('../../models/channelModel');
// const Video = require('../../models/videoModel');
// const Wire = require('../../models/wireModel');
const catchAsync = require('../../utils/catchAsync');

const applySubscription = catchAsync(async (subscription) => {
  try {
    // 2) GET USER
    console.log(`USER ID`, subscription.user);
    const userId = subscription.user;

    const userData = await User.findById(userId).populate({
      path: 'subscriptions',
    });

    if (!userData) throw new Error('User not found');

    // 2. Mark the current active subscription as inactive
    const activeSubscription = await Subscription.findOne({
      user: userId,
      active: true,
    });

    console.log(`ACTIVE SUBSCRIPTION`, activeSubscription);

    if (activeSubscription) {
      activeSubscription.active = false;
      activeSubscription.status = 'inactive';
      activeSubscription.expiredAt = new Date();
      await activeSubscription.save();
    }

    // 3. Link the new subscription to the user
    userData.subscriptions.push(subscription._id);
    userData.currentActiveSubscription = subscription._id;
    await userData.save();
    console.log(`USER DATA`, userData);

    // 4. Aggregate all feature permissions dynamically from features maps
    const aggregatedFeatures = {};

    userData.subscriptions.forEach((sub) => {
      const { features } = sub; // This is the features map
      if (features instanceof Map || typeof features === 'object') {
        Object.entries(features).forEach(([key, value]) => {
          // If the feature is already true, skip; otherwise, set its value
          if (!aggregatedFeatures[key]) {
            aggregatedFeatures[key] = value;
          }
        });
      }
    });

    console.log('Aggregated Features:', aggregatedFeatures);

    // TODO: Use aggregatedFeatures for further logic
    // e.g., enabling or disabling user permissions, managing subscriptions, etc.

    console.log('Subscription applied successfully');

    // const { features } = userData.subscriptions;

    // console.log(`FEATUES WITHIN USER SUBSCRIPTION:`, features);

    // let videoPermission;
    // let channelPermission;
    // let wirePermission;
    // let contentBoostPermission;
    // let allAdsRemovedPermission;
    // let eventNotificationPermission;

    // Ensure that subscriptions is an array and then access features from each subscription
    // if (userData.subscriptions && Array.isArray(userData.subscriptions)) {
    //   userData.subscriptions.forEach((subscription) => {
    //     const { features } = subscription;
    //     console.log(`FEATURES WITHIN USER SUBSCRIPTION:`, features);

    //     // Now you can work with the features of each subscription
    //     let videoPermission = features.get('videoUpload') || false; // Check for 'videoUpload'
    //     let channelPermission = features.get('channelCreation') || false; // Check for 'channelCreation'
    //     let wirePermission = features.get('wires') || false; // Check for 'wires'
    //     let contentBoostPermission = features.get('contentBoost') || false; // Check for 'contentBoost'
    //     let allAdsRemovedPermission = features.get('allAds') || false; // Check for 'allAds'
    //     let eventNotificationPermission =
    //       features.get('eventNotification') || false; // Check for 'eventNotification'

    //     console.log(`VIDEO PERMISSION:`, videoPermission);
    //     console.log(`CHANNEL PERMISSION:`, channelPermission);
    //     console.log(`WIRE PERMISSION:`, wirePermission);
    //     console.log(`CONTENT BOOST PERMISSION:`, contentBoostPermission);
    //     console.log(`ALL ADS REMOVED PERMISSION:`, allAdsRemovedPermission);
    //     console.log(
    //       `EVENT NOTIFICATION PERMISSION:`,
    //       eventNotificationPermission,
    //     );

    // Use the permissions as needed...
    // });
    // }

    // 3) Change Feature Authorization
  } catch (err) {
    console.log(
      `❌❌❌ ERROR | SUBSCRIPTION HANDLER | SUBSCRIPTION CONTROLLER ❌❌❌`,
      err,
    );
    throw err;
  }
});

module.exports = applySubscription;
