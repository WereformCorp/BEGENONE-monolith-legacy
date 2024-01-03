const mongoose = require('mongoose');
const Comment = require('../models/commentModel');
const Video = require('../models/videoModel');
const Channel = require('../models/channelModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.setVideoIds = (req, res, next) => {
  if (!req.body.video) req.body.video = req.params.videoId;

  console.log(req.body.video);

  if (!mongoose.Types.ObjectId.isValid(req.body.video)) {
    return next(new AppError('Invalid video ID', 400));
  }

  next();
};

exports.getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find();

  if (!comments) next(new AppError(`Comments Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    results: comments.length,
    comments,
  });
});

exports.getComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) next(new AppError(`Comment Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    comment,
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!comment) {
      return next(new AppError('No document Found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      comment,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

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
    console.log(err, err.message);
  }
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      comment,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});
