/**
 * @fileoverview Subscription status state management utility
 * @module controllers/util-controllers/updateSubscriptionStatus
 * @layer Utility
 *
 * @description
 * Provides a reusable function to atomically update a subscription's status,
 * active flag, and endDate fields by matching on the Stripe subscription ID.
 * Returns the updated subscription document.
 *
 * @dependencies
 * - Upstream: Webhook handlers, subscription lifecycle controllers
 * - Downstream: Subscription model
 */
const Subscription = require('../../models/subscriptionModel');

/**
 * Updates the status, active flag, and endDate of a subscription identified by its Stripe ID.
 * @param {string} subscriptionId - Stripe subscription identifier
 * @param {string} status - New status value (e.g., "active", "inactive", "canceled")
 * @param {boolean} isActive - Whether the subscription should be marked active
 * @param {Date|null} endDate - Subscription end date, or null if ongoing
 * @returns {Object|null} Updated Subscription document or null if not found
 */
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
