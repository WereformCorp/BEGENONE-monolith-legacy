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
});

const Notification = mongoose.model('Notification', notificationSchema);
// (async function () {
//   await Notification.create();
// })();

module.exports = Notification;
