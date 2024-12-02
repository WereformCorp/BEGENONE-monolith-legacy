const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  views: Number,
  likes: Number,
  audio: Boolean,
  video: String,
  viewers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      select: 'Name Photo Time',
    },
  ],
  time: {
    type: Date,
    default: Date.now(),
  },
  endIn: {
    type: Date, // Set expiration 24 hours from creation
  },
  channel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Channel',
  },
  active: {
    type: Boolean,
    default: false,
  },
});

// THIS IS HOW THE VIDEO WILL GET REMOVED AFTER 24 HOURS
// const now = Date.now();
// const stories = await Story.find({ endIn: { $gt: now } }); // Only retrieve non-expired

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
