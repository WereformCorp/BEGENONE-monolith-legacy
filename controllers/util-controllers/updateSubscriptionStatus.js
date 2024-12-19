const Subscription = require('../../models/subscriptionModel');

// Utility to update subscription status in the database
const updateSubscriptionStatus = async (
  subscriptionId,
  status,
  isActive,
  endDate,
) => {
  const subscription = await Subscription.findOneAndUpdate(
    { stripeId: subscriptionId },
    { $set: { status, active: isActive, endDate } },
    { new: true },
  );
  return subscription;
};

module.exports = updateSubscriptionStatus;
