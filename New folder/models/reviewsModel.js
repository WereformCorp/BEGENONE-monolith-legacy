const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    select: 'name _id photo',
  },
  time: {
    type: Date,
    default: Date.now(),
  },
  ratings: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  channel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Channel',
  },
  review: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 500,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    select: '_id',
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
