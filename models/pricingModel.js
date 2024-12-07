const mongoose = require('mongoose');

// Define the schema for the Subscription model
const pricingSchema = new mongoose.Schema({
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
      'signup',
    ], // E.g., "Early Access"
    default: 'signup',
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
    default: {
      videoUpload: /*          */ { type: Boolean, default: false },
      channelCreation: /*      */ { type: Boolean, default: false },
      allAds: /*               */ { type: Boolean, default: false },
      inVideoAds: /*           */ { type: Boolean, default: false },
      premiumStickers: /*      */ { type: Boolean, default: false },
      premiumReach: /*         */ { type: Boolean, default: false },
      promotion: /*            */ { type: Boolean, default: false },
      monetization: /*         */ { type: Boolean, default: false },
      communityPost: /*        */ { type: Boolean, default: false },
      stories: /*              */ { type: Boolean, default: false },
      wires: /*                */ { type: Boolean, default: false },
      eventNotification: /*    */ { type: Boolean, default: false },
      contentMonetization: /*  */ { type: Boolean, default: false },
      impressionMarketplace: /**/ { type: Boolean, default: false },
      themes: /*               */ { type: Boolean, default: false },
      impressionSystem: /*     */ { type: Boolean, default: false },
      algorithmControl: /*     */ { type: Boolean, default: false },
      channelIntro: /*         */ { type: Boolean, default: false },
      sponsorship: /*          */ { type: Boolean, default: false },
      teamManagementConsole: /**/ { type: Boolean, default: false },
      channelCustomSort: /*    */ { type: Boolean, default: false },
      channelSpecialEffects: /**/ { type: Boolean, default: false },
      // dataAuth:/*              */ { type: Boolean, default: false },
    }, // Store features as key-value pairs where keys are feature names and values are whether it's enabled or not
    required: true,
  },
  limits: {
    type: Map,
    of: Number,
    default: {}, // Limits for services (e.g., "Impressions": 1000)
    required: false,
  },
  active: {
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

const pricing = mongoose.model('Pricing', pricingSchema);

module.exports = pricing;
