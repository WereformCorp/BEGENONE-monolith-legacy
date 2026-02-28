/**
 * @fileoverview Subscription schema binding users to pricing plans with Stripe integration.
 * @module models/subscriptionModel
 * @layer Model
 * @collection subscriptions
 *
 * @description
 * Defines the Subscription document schema that associates a User with a Pricing plan.
 * Tracks Stripe identifiers, payment method details, subscription lifecycle dates,
 * status (active, canceled, expired, pending, inactive), and auto-renewal preference.
 * Pre-find hooks auto-populate the referenced User and Pricing documents.
 *
 * @relationships
 * - user: ObjectId ref -> User
 * - pricings: ObjectId ref -> Pricing
 *
 * @dependencies
 * - Upstream: controllers/pricing-controllers/*, User.subscriptions, User.currentActiveSubscription
 * - Downstream: mongoose, models/User, models/Pricing
 *
 * @security
 * stripeId and paymentDetails.transactionId store third-party payment identifiers.
 */

const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Subscription must belong to a user!'],
  },
  pricingName: {
    type: String,
    default: null,
  },
  pricings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pricing',
    required: [true, 'Subscription must be linked to a pricing plan!'],
  },
  stripeId: String,
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['card', 'paypal', 'crypto'],
    },
    transactionId: String,
  },
  status: {
    type: String,
    enum: ['inactive', 'active', 'canceled', 'expired', 'pending'],
    default: 'inactive',
  },
  autoRenew: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

subscriptionSchema.pre(/^find/, function (next) {
  this.populate('user').populate('pricing');
  next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
