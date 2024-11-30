const mongoose = require('mongoose');

// Define the schema for the Subscription model
const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: [
      'early-access',
      'basic',
      'standard',
      'premium',
      'premium-plus',
      'gift',
      'limited',
    ], // E.g., "Early Access"
    default: 'basic',
  },
  description: {
    type: String,
    required: true, // Brief description of the subscription
  },
  price: {
    type: Number,
    required: true, // Price for the subscription, e.g., 9.99
  },
  features: {
    type: Map,
    of: Boolean,
    default: {}, // Store features as key-value pairs where keys are feature names and values are whether it's enabled or not
    required: true,
  },
  limits: {
    type: Map,
    of: Number,
    default: {}, // Limits for services (e.g., "Impressions": 1000)
    required: false,
  },
  isActive: {
    type: Boolean,
    default: false, // Whether the subscription is active or disabled
  },
  createdAt: {
    type: Date,
    default: Date.now(), // Automatically set when the subscription is created
  },
  updatedAt: {
    type: Date,
    default: Date.now(), // Automatically set when the subscription is updated
  },
});

const subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = subscription;
