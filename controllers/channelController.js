const Channel = require('../models/channelModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllChannels = catchAsync(async (req, res, next) => {
  const channels = await Channel.find();

  if (!channels) next(new AppError(`Data Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    results: channels.length,
    channels,
  });
});

exports.getChannel = catchAsync(async (req, res, next) => {
  const channel = await Channel.findById(req.params.id);

  if (!channel) next(new AppError(`Channels Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    channel,
  });
});

exports.updateChannel = catchAsync(async (req, res, next) => {
  try {
    const channel = await Channel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!channel) {
      return next(new AppError('No document Found with that ID', 404));
    }

    // if (channel.channelUsername)
    res.status(200).json({
      status: 'success',
      channel,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.createChannel = catchAsync(async (req, res, next) => {
  try {
    const channelData = await Channel.create({
      channelUsername: req.body.channelUsername,
      name: req.body.name,
      displayImage: req.body.displayImage,
      bannerImage: req.body.bannerImage,
      about: req.body.about,
      products: req.body.products,
      commentToggle: req.body.commentToggle,
      comments: req.body.comments,
      commentFilters: req.body.commentFilters,
      video: req.body.video,
      cdmodel: req.body.cdmodel,
      user: req.body.user,
      sponsors: req.body.sponsors,
      story: req.body.story,
    });

    if (!channelData) next(new AppError(`Data Not Found!`, 404));
    // if (!channelData.section) channelData.section = [];

    res.status(201).json({
      status: 'Success',
      data: channelData,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});

exports.deleteChannel = catchAsync(async (req, res, next) => {
  try {
    const channel = await Channel.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'Success',
      channel,
    });
  } catch (err) {
    console.log(err, err.message);
  }
});
