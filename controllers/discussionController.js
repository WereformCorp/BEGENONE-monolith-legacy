const Discussion = require('../models/discussionModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllDiscussions = catchAsync(async (req, res, next) => {
  const discussions = await Discussion.find();

  if (!discussions) next(new AppError(`Discussions Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    results: discussions.length,
    discussions,
  });
});

exports.getDiscussion = catchAsync(async (req, res, next) => {
  const discussion = await Discussion.findById(req.params.id);

  if (!discussion) next(new AppError(`Data Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    discussion,
  });
});

exports.updateDiscussion = catchAsync(async (req, res, next) => {
  try {
    const discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    if (!discussion) {
      return next(new AppError('No document Found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      discussion,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.createDiscussion = catchAsync(async (req, res, next) => {
  try {
    const discussionData = await Discussion.create({
      heading: req.body.heading,
      subHeading: req.body.subHeading,
      bookmark: req.body.bookmark,
      discussionText: req.body.discussionText,
    });

    if (!discussionData) next(new AppError(`Data Not Found!`, 404));

    res.status(201).json({
      status: 'Success',
      data: discussionData,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.deleteDiscussion = catchAsync(async (req, res, next) => {
  try {
    const discussion = await Discussion.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      discussion,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});
