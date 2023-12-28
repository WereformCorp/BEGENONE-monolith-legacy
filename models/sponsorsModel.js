const mongoose = require('mongoose');

const sponsorSchema = mongoose.Schema({
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
    type: String,
    required: true,
    min: 1,
    max: 6,
  },
  channel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Channel',
    select: 'Name _id displayImage',
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
    select: 'Name _id Photo',
  },
});

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

module.exports = Sponsor;
