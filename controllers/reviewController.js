const Review = require('../models/reviewsModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
    });

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
