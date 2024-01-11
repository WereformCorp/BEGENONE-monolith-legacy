const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  channelUserName: {
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
  displayImage: {
    type: String,
    default: 'default.jpeg',
  },
  bannerImage: String,
  about: {
    type: String,
    maxLength: 1000,
  },
  subscribersCount: {
    type: Number,
    default: 0,
  },
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Review',
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
  videos: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Video',
    },
  ],
  wires: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Wire',
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
  tagsList: [
    {
      type: String,
    },
  ],
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

channelSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'sponsors',
    select:
      '-__v -video -gallery -companyLogo -productDescription -companyWebsite -productWebsite -productPromoCode -messageAdOwner -messageContentCreator',
  });

  this.populate({
    path: 'reviews',
    select: '-__v',
  });

  this.populate({
    path: 'videos',
    select:
      '-bookmark -sponsors -comments -tags -description -thumbnail -section -channel -audio -videos -__v',
  });

  this.populate({
    path: 'products',
    select: '-specification -reviews -paid -description -thumbnail -__v',
  });

  this.populate({
    path: 'comments',
    select: '-video -__v',
    // _id reply comment
  });

  this.populate({
    path: 'story',
    select: '-__v',
  });

  this.populate({
    path: 'wires',
    select: '-__v',
  });

  this.populate({
    path: 'user',
    select: '_id',
  });

  next();
});

// channelSchema.pre('remove', async function (next) {
//   // 'this' refers to the channel being removed
//   const channelId = this._id;

//   // Delete associated videos
//   await Video.deleteMany({ channel: channelId });

//   next();
// });

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
