const Video = require('../models/videoModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllVideos = catchAsync(async (req, res, next) => {
  const data = await Video.find();

  if (!data) next(new AppError(`Data Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    data,
  });
});

exports.getVideo = catchAsync(async (req, res, next) => {
  const data = await Video.findById();

  if (!data) next(new AppError(`Data Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    data,
  });
});

exports.updateVideo = catchAsync(async (req, res, next) => {
  const data = await Video.findByIdAndUpdate(req.params.id, req.body);

  if (!data) next(new AppError(`Data Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    data: data,
  });
});
