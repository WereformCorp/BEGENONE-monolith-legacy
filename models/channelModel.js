const mongoose = require('mongoose');

const channelSchema = mongoose.Schema({
  username: {
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
    maxLength: 700,
  },
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Review',
      select: 'Name _id thumbnail ratings price',
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
  lvmodel: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'LVM',
    },
  ],
  cdmodel: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'CDM',
    },
  ],
  svmodel: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'SVM',
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
