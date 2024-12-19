const Subscription = require('../../models/subscriptionModel');

const checkSubscriptionAccess = async (req, res, next) => {
  const userId = req.user.id; // Assuming you have user data in the request
  const currentSubscription = await Subscription.findOne({
    user: userId,
    status: 'active',
    validUntil: { $gte: new Date() }, // Ensure it's still valid
  });

  if (!currentSubscription) {
    return res.status(403).json({ message: 'No active subscription' });
  }

  next();
};

module.exports = checkSubscriptionAccess;
