const Story = require('../models/storyModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllStories = catchAsync(async (req, res, next) => {
  const stories = await Story.find();

  if (!stories) next(new AppError(`Stories Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    results: stories.length,
    stories,
  });
});

exports.getStory = catchAsync(async (req, res, next) => {
  const stories = await Story.findById(req.params.id);

  if (!stories) next(new AppError(`Product Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    stories,
  });
});

exports.updateStory = catchAsync(async (req, res, next) => {
  try {
    const stories = await Story.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!stories) {
      return next(new AppError('No document Found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      stories,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.createStory = catchAsync(async (req, res, next) => {
  try {
    const storyData = await Story.create({
      video: req.body.video,
    });

    if (!storyData) next(new AppError(`Data Not Found!`, 404));

    res.status(201).json({
      status: 'Success',
      data: storyData,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.deleteStory = catchAsync(async (req, res, next) => {
  try {
    const stories = await Story.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      stories,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});
