const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
  channelLogo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Channel',
    select: 'name displayImage',
  },
  companyLogo: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
    maxLength: 150,
  },
  productName: {
    type: String,
    required: true,
    maxLength: 100,
  },
  productDescription: {
    type: String,
    required: true,
    maxLength: 500,
  },
  gallery: {
    type: [String],
    required: true,
    min: 1,
    max: 6,
  },
  channel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Channel',
    select: 'name _id displayImage',
  },
  companyWebsite: {
    type: String,
  },
  productWebsite: {
    type: String,
  },
  productPromoCode: {
    type: String,
  },
  messageAdOwner: {
    type: String,
    maxLength: 500,
  },
  messageContentCreator: {
    type: String,
    maxLength: 500,
  },
  video: {
    type: mongoose.Schema.ObjectId,
    ref: 'Video',
    select: '_id',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    select: 'name _id Photo',
  },
});

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

module.exports = Sponsor;
