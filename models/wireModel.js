/**
 * @fileoverview Wire schema for short-form text content posts.
 * @module models/wireModel
 * @layer Model
 * @collection wires
 *
 * @description
 * Defines the Wire document schema representing short-form text content with heading,
 * subheading, body text (wireText), engagement counters (views, likes), and a bookmark
 * flag. Each Wire is associated with a Channel. Pre-find hooks auto-populate the
 * referenced Channel document.
 *
 * @relationships
 * - channel: ObjectId ref -> Channel
 *
 * @dependencies
 * - Upstream: controllers/wires-controller/*, routes/wireRoutes
 * - Downstream: mongoose, models/Channel
 */

const mongoose = require('mongoose');

const wireSchema = new mongoose.Schema({
  heading: {
    type: String,
    maxLength: 100,
  },
  subHeading: {
    type: String,
    maxLength: 200,
  },
  views: Number,
  channel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Channel',
    select: 'name _id displayImage',
  },
  time: {
    type: Date,
    default: Date.now(),
  },
  likes: Number,
  bookmark: {
    type: Boolean,
    default: false,
  },
  wireText: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 2500,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

wireSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'channel',
    select: '_id',
  });

  next();
});

const Wire = mongoose.model('Wire', wireSchema);

module.exports = Wire;
