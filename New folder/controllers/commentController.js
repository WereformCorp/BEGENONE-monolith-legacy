const mongoose = require('mongoose');
const Comment = require('../models/commentModel');
const Video = require('../models/videoModel');
const Channel = require('../models/channelModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerController');

exports.setVideoIds = (req, res, next) => {
  if (!req.body.video) req.body.video = req.params.videoId;
  if (!mongoose.Types.ObjectId.isValid(req.body.video)) {
    return next(new AppError('Invalid video ID', 400));
  }
  next();
};

exports.getAllComments = factory.getAll(Comment);
exports.getComment = factory.getOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
exports.createComment = catchAsync(async (req, res, next) => {
  try {
    const commentData = await Comment.create({
      comment: req.body.comment,
      video: req.params.videoId,
      channel: req.user.channel._id,
      time: Date.now(),
    });

    if (!commentData.video) return next(new AppError(`Video Not Found!`, 404));

    const video = Video.findById(req.params.videoId);
    if (!video.comments) {
      video.comments = [];
    }

    // await Video.findByIdAndUpdate(
    //   req.params.videoId,
    //   { $push: { comments: commentData._id } },
    //   { new: true },
    // );

    // if (!commentData)
    //   Video.findByIdAndUpdate(req.params.videoId, { comments: [] });

    if (!commentData)
      return next(new AppError(`Comment creation failed!`, 500));

    // const video = await Video.findById(req.params.videoId);
    await Channel.findByIdAndUpdate(
      req.user.channel._id,
      { comments: commentData._id },
      { new: true, select: '_id' },
    );

    await Video.findByIdAndUpdate(
      req.params.videoId,
      { $push: { comments: commentData._id } },
      { new: true },
    );

    if (!commentData) next(new AppError(`Data Not Found!`, 404));

    return res.status(201).json({
      status: 'Success',
      data: commentData,
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err.message,
      err,
    });
  }
});
