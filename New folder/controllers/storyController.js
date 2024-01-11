// const mongoose = require('mongoose');
const Story = require('../models/storyModel');
const Channel = require('../models/channelModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerController');

exports.getAllStories = factory.getAll(Story);
exports.getStory = factory.getOne(Story);
exports.updateStory = factory.updateOne(Story);
exports.deleteStory = factory.deleteOne(Story);
exports.createStory = catchAsync(async (req, res, next) => {
  try {
    const storyData = await Story.create({
      video: req.body.video,
      channel: req.user.channel._id,
    });

    await Channel.findByIdAndUpdate(
      req.user.channel._id,
      { story: storyData._id },
      { new: true, select: '_id' },
    );

    if (!storyData)
      Channel.findByIdAndUpdate(req.user.channel._id, { story: [] });

    if (!storyData) next(new AppError(`Data Not Found!`, 404));

    res.status(201).json({
      status: 'Success',
      data: storyData,
    });
  } catch (err) {
    res.json({
      status: 'fail',
      message: err.message,
      err,
    });
  }
});
