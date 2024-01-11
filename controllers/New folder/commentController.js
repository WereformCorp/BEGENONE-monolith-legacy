const mongoose = require('mongoose');
const Comment = require('../models/commentModel');
const Video = require('../models/videoModel');
const Channel = require('../models/channelModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerController');

exports.setVideoIds = (req, res, next) => {
  if (!req.body.video) req.body.video = req.params.videoId;
  if (!mongoose.Types.ObjectId.isValid(req.body.video))
    return next(new AppError('Invalid video ID', 400));
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
    });

    if (!(await Video.findById(req.params.videoId)))
      return next(new AppError(`Video Not Found!`, 404));

    await Video.findByIdAndUpdate(
      req.params.videoId,
      { comments: commentData._id },
      { new: true },
    );

    if (!commentData)
      Video.findByIdAndUpdate(req.params.videoId, { comments: [] });

    const video = await Video.findById(commentData.video);
    await Channel.findByIdAndUpdate(
      video.channel._id,
      { $push: { comments: commentData._id } },
      { new: true, select: '_id' },
    );

    if (!commentData)
      Channel.findByIdAndUpdate(video.channel._id, { comments: [] });

    if (!commentData) next(new AppError(`Data Not Found!`, 404));

    return res.status(201).json({
      status: 'Success',
      data: commentData,
    });
  } catch (err) {
    res.json({
      status: 'fail',
      message: err.message,
      err,
    });
  }
});
