/**
 * @fileoverview Subscription access validation with expiry check
 * @module controllers/util-controllers/subscriptionAccessControl
 * @layer Middleware
 *
 * @description
 * Middleware that verifies the authenticated user has an active, non-expired
 * subscription by querying for a subscription document whose status is
 * "active" and whose validUntil date is in the future. Returns 403 if no
 * qualifying subscription is found.
 *
 * @dependencies
 * - Upstream: Protected routes requiring paid subscription access
 * - Downstream: Subscription model
 *
 * @security Enforces time-bound subscription validity; rejects expired or inactive subscriptions.
 */
const Subscription = require('../../models/subscriptionModel');

/**
 * Validates that the current user has a non-expired active subscription.
 * @param {Object} req - Express request; expects req.user.id
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
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
