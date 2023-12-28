const mongoose = require('mongoose');

const productSchema = mongoose.Schema.ObjectId({
  title: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 50,
  },
  description: {
    type: String,
    required: true,
    maxLength: 300,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  channel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Channel',
    select: 'Name _id displayImage',
  },
  specification: {
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      select: 'Name Photo',
    },
    gallery: {
      type: String,
      min: 1,
      max: 6,
    },
    date: [
      {
        type: Date,
        default: Date.now(),
      },
    ],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    select: 'Name _id Photo',
  },
  reviews: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Review',
    },
  ],
  price: {
    type: Number,
    required: [true, `Product Must Have A Price.`],
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
