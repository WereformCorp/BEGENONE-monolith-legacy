const mongoose = require('mongoose');
const Wire = require('../models/wireModel');
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

exports.getAllWires = catchAsync(async (req, res, next) => {
  const wires = await Wire.find();

  if (!wires) next(new AppError(`Wire Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    results: wires.length,
    data: wires,
  });
});

exports.getWire = catchAsync(async (req, res, next) => {
  const wire = await Wire.findById(req.params.id);

  if (!wire) next(new AppError(`Wire Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    data: wire,
  });
});

exports.updateWire = catchAsync(async (req, res, next) => {
  try {
    const wires = await Wire.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!wires) {
      return next(new AppError('No document Found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: wires,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.createWire = catchAsync(async (req, res, next) => {
  try {
    const wireData = await Wire.create({
      heading: req.body.heading,
      subHeading: req.body.subHeading,
      bookmark: req.body.bookmark,
      wireText: req.body.wireText,
      channel: req.params.channelId,
    });

    await Channel.findByIdAndUpdate(
      req.params.channelId,
      { $push: { wires: wireData._id } },
      { new: true },
    );

    if (!wireData)
      Channel.findByIdAndUpdate(req.params.channelId, { wires: [] });

    if (!wireData) next(new AppError(`Data Not Found!`, 404));

    if (wireData)
      return res.status(201).json({
        status: 'Success',
        data: wireData,
      });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.deleteWire = catchAsync(async (req, res, next) => {
  try {
    const wire = await Wire.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      data: wire,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});
