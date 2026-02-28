/**
 * @fileoverview Notification schema for user event alerts (partially implemented).
 * @module models/notificationModel
 * @layer Model
 * @collection notifications
 *
 * @description
 * Defines the Notification document schema intended to track user-facing alerts
 * related to channel and video events. Currently stores userId, channelId, and
 * videoId as plain strings (ObjectId references are commented out), along with
 * a timestamp, read status, and active flag. This model is partially implemented
 * and pending full integration with the User, Channel, and Video models.
 *
 * @relationships
 * - userId: String (intended ref -> User)
 * - channelId: String (intended ref -> Channel)
 * - videoId: String (intended ref -> Video)
 *
 * @dependencies
 * - Upstream: (not yet wired to controllers/routes)
 * - Downstream: mongoose
 */

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    // type: mongoose.Schema.ObjectId,
    // ref: 'User',
    // required: true,
    type: String,
  },
  channelId: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Channel',
    // required: true,
    type: String,
  },
  videoId: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Video',
    // required: true,
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  readStatus: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);
// (async function () {
//   await Notification.create();
// })();

module.exports = Notification;
