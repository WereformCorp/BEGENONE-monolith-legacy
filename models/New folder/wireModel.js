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
