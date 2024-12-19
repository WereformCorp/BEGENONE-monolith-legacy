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
    // 1) Get User From Subscriptions.
    // 2) Select the previous current Subscription and deactivate it.
    // 3) Add the newly created Subscription to the CurrentActiveSubscription Field.

    // GET USER
    console.log(`SUBSCRIPTION FROM APPLY_SUBSCRIPTION FUNCTION:`, subscription);
    console.log(`USER ID`, subscription.user);
    const userId = subscription.user;

    const userData = await User.findById(userId).populate({
      path: 'subscriptions',
    });

    if (!userData) throw new Error('User not found');

    // 2. Mark the current active subscription as inactive
    const activeSubscription = await Subscription.findOne({
      user: userId,
      currentActiveSubscription: subscription._id,
      active: true,
    });

    console.log(`ACTIVE SUBSCRIPTION`, activeSubscription);

    if (activeSubscription && activeSubscription._id === subscription._id) {
      activeSubscription.active = false;
      activeSubscription.status = 'inactive';
      activeSubscription.autoRenew = false;
      activeSubscription.endDate = new Date();
      await activeSubscription.save();
    }
    console.log(`USER DATA SUBSCRIPTIONS:`, userData.subscriptions);
    console.log(`ACTIVE SUBSCRIPTIONS:`, activeSubscription);

    // 3. Link the new subscription to the user
    userData.subscriptions.push(subscription._id); // Add new subscription to user's subscriptions
    userData.currentActiveSubscription = subscription._id; // Set the new subscription as active
    await userData.save();

    console.log(`USER DATA`, userData);
    console.log('Subscription applied successfully');
  } catch (err) {
    console.log(
      `❌❌❌ ERROR | SUBSCRIPTION HANDLER | SUBSCRIPTION CONTROLLER ❌❌❌`,
      err,
    );
    throw err;
  }
});

module.exports = applySubscription;
