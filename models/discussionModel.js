const mongoose = require('mongoose');

const discussionSchema = mongoose.Schema({
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
    select: 'Name _id Photo',
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
  discussionTest: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 2500,
  },
});

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
