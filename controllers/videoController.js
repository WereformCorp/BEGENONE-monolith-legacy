const Video = require('../models/videoModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllVideos = catchAsync(async (req, res, next) => {
  const data = await Video.find();

  if (!data) next(new AppError(`Data Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    results: data.length,
    data,
  });
});

exports.getVideo = catchAsync(async (req, res, next) => {
  const data = await Video.findById(req.params.id);

  if (!data) next(new AppError(`Data Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    data,
  });
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
      channel: req.body.channel,
      bookmark: req.body.bookmark,
      sponsors: req.body.sponsors,
      comments: req.body.comments,
      audio: req.body.audio,
      video: req.body.video,
    });

    if (!videoData) next(new AppError(`Data Not Found!`, 404));
    if (!videoData.section) videoData.section = [];

    res.status(201).json({
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
