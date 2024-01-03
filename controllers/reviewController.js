const mongoose = require('mongoose');
const Review = require('../models/reviewsModel');
const Product = require('../models/productModel');
const Channel = require('../models/channelModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.setProductIds = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;

  console.log(req.body.product);

  if (!mongoose.Types.ObjectId.isValid(req.body.product)) {
    return next(new AppError('Invalid channel ID', 400));
  }

  next();
};

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  if (!reviews) next(new AppError(`Reviews Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    results: reviews.length,
    reviews,
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.findById(req.params.id);

  if (!reviews) next(new AppError(`Review Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    reviews,
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  try {
    const reviews = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!reviews) {
      return next(new AppError('No document Found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      reviews,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.createReview = catchAsync(async (req, res, next) => {
  try {
    const reviewData = await Review.create({
      ratings: req.body.ratings,
      review: req.body.review,
      product: req.params.productId,
    });

    if (!(await Product.findById(req.params.productId)))
      return next(new AppError(`Product Not Found!`, 404));

    await Product.findByIdAndUpdate(
      req.params.productId,
      { reviews: reviewData._id },
      { new: true },
    );

    if (!reviewData)
      Product.findByIdAndUpdate(req.params.productId, { reviews: [] });

    const product = await Product.findById(reviewData.product);
    await Channel.findByIdAndUpdate(
      product.channel._id,
      { $push: { reviews: reviewData._id } },
      { new: true, select: '_id' },
    );

    if (!reviewData)
      Channel.findByIdAndUpdate(product.channel._id, { reviews: [] });

    if (!reviewData) next(new AppError(`Data Not Found!`, 404));

    res.status(201).json({
      status: 'Success',
      data: reviewData,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  try {
    const reviews = await Review.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      reviews,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});
