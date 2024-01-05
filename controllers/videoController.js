const mongoose = require('mongoose');
const Video = require('../models/videoModel');
const Channel = require('../models/channelModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.setChannelIds = (req, res, next) => {
  if (!req.body.channel) req.body.channel = req.params.channelId;

  console.log(req.body.channel);

  if (!mongoose.Types.ObjectId.isValid(req.body.channel)) {
    return next(new AppError('Invalid channel ID', 400));
  }

  next();
};

exports.getAllVideos = catchAsync(async (req, res, next) => {
  const data = await Video.find();
  // .populate({
  //   path: 'comments',
  // });

  if (!data) next(new AppError(`Data Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    results: data.length,
    data,
  });
});

exports.getVideo = catchAsync(async (req, res, next) => {
  try {
    const data = await Video.findById(req.params.id);
    // .populate({
    //   path: 'comments',
    // });

    console.log(data);

    if (!data) return next(new AppError(`Data Not Found!`, 404));

    if (data)
      return res.status(200).json({
        status: 'Success',
        data,
      });
  } catch (err) {
    console.log(err);
  }
});

exports.updateVideo = catchAsync(async (req, res, next) => {
  try {
    const data = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!data) {
      return next(new AppError('No document Found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.createVideo = catchAsync(async (req, res, next) => {
  try {
    const videoData = await Video.create({
      title: req.body.title,
      description: req.body.description,
      thumbnail: req.body.thumbnail,
      section: req.body.section,
      channel: req.params.channelId,
      bookmark: req.body.bookmark,
      sponsors: req.body.sponsors,
      comments: req.body.comments,
      audio: req.body.audio,
      videos: req.body.videos,
    });

    await Channel.findByIdAndUpdate(
      req.params.channelId,
      { videos: videoData._id },
      { new: true, select: '_id' },
    );

    if (!videoData)
      Channel.findByIdAndUpdate(req.params.channelId, { videos: [] });

    if (!videoData) next(new AppError(`Data Not Found!`, 404));
    if (!videoData.section) videoData.section = [];
    // if (videoData.channel) videoData.channel = videoData.channel._id;

    if (videoData)
      return res.status(201).json({
        status: 'Success',
        data: videoData,
      });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.deleteVideo = catchAsync(async (req, res, next) => {
  try {
    const data = await Video.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      data,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});
