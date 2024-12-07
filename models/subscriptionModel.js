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
    enum: ['inactive', 'active', 'cancelled', 'expired', 'pending'],
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
