const mongoose = require('mongoose');
const Channel = require('../models/channelModel');
const User = require('../models/userModel');
const Video = require('../models/videoModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.setUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.params.userId;

  console.log(req.body.user);

  if (!mongoose.Types.ObjectId.isValid(req.body.user)) {
    return next(new AppError('Invalid User ID', 400));
  }

  next();
};

exports.getAllChannels = catchAsync(async (req, res, next) => {
  const channels = await Channel.find();
  // .populate({
  //   path: 'videos',
  //   select: '_id',
  // });

  if (!channels) next(new AppError(`Data Not Found!`, 404));

  res.status(200).json({
    status: 'Success',
    results: channels.length,
    channels,
  });
});

exports.getChannel = catchAsync(async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);
    // .populate({
    //   path: 'videos',
    //   select: '_id',
    // })
    // .execPopulate();

    if (!channel) return next(new AppError(`Channels Not Found!`, 404));

    if (channel)
      return res.status(200).json({
        status: 'Success',
        data: channel,
      });
  } catch (err) {
    console.error(err);
  }
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
      channelUserName: req.body.channelUserName,
      name: req.body.name,
      displayImage: req.body.displayImage,
      bannerImage: req.body.bannerImage,
      about: req.body.about,
      products: req.body.products,
      reviews: req.body.reviews,
      commentToggle: req.body.commentToggle,
      comments: req.body.comments,
      commentFilters: req.body.commentFilters,
      videos: req.body.videos,
      wires: req.body.wires,
      user: req.params.userId,
      sponsors: req.body.sponsors,
      story: req.body.story,
    });

    await User.findByIdAndUpdate(
      req.params.userId,
      {
        channel: channelData._id,
      },
      { new: true, select: '_id' },
    );

    if (!channelData)
      User.findByIdAndUpdate(req.params.userId, { channel: [] });

    const videos = await Video.find({ _id: { $in: channelData.videos } });
    // const sponsorsId = videos.sponsors;
    const sponsorsId = videos.reduce(
      (acc, video) => acc.concat(video.sponsors),
      [],
    );

    await Channel.findByIdAndUpdate(
      channelData._id,
      { sponsors: sponsorsId._id },
      { new: true, select: '_id' },
    );

    if (!channelData)
      Channel.findByIdAndUpdate(req.params.channelId, { sponsors: [] });

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
