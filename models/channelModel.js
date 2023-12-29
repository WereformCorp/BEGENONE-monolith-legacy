const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  channelUsername: {
    type: String,
    required: true,
    unique: true,
    minLength: 1,
    maxLength: 50,
  },
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  displayImage: String,
  bannerImage: String,
  about: {
    type: String,
    maxLength: 1000,
  },
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Review',
      select: 'name _id thumbnail ratings price',
    },
  ],
  commentToggle: {
    type: Boolean,
    default: false,
  },
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
    },
  ],
  commentFilters: [String],
  video: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Video',
    },
  ],
  cdmodel: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'CDM',
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  sponsors: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Sponsor',
    },
  ],
  story: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Story',
    },
  ],
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
