const Channel = require('../../models/channelModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/userModel');
const Video = require('../../models/videoModel');

const createChannel = catchAsync(async (req, res, next) => {
  try {
    const existingChannel = await Channel.findOne({ user: req.user._id });

    if (existingChannel) {
      // If a channel already exists, send an error response
      return res.status(400).json({
        status: 'fail',
        message: 'User already has a channel.',
      });
    }

    const channelData = await Channel.create({
      channelUserName: req.body.channelUserName,
      name: req.body.name,
      displayImage: req.body.displayImage,
      bannerImage: req.body.bannerImage,
      about: req.body.about,
      subscribers: req.body.subscribers,
      products: req.body.products,
      reviews: req.body.reviews,
      commentToggle: req.body.commentToggle,
      comments: req.body.comments,
      commentFilters: req.body.commentFilters,
      videos: req.body.videos,
      wires: req.body.wires,
      user: req.user._id,
      sponsors: req.body.sponsors,
      story: req.body.story,
    });

    if (!channelData.displayImage)
      channelData.displayImage = '/imgs/users/default.jpeg';

    await User.findByIdAndUpdate(
      req.user._id,
      { channel: channelData._id },
      { new: true },
    );

    if (!channelData)
      await User.findByIdAndUpdate(req.user._id, { channel: [] });

    const videos = await Video.find({ _id: { $in: channelData.videos } });
    // const sponsorsId = videos.sponsors;
    const sponsorsId = videos.reduce(
      (acc, video) => acc.concat(video.sponsors),
      [],
    );

    const commentId = videos.reduce(
      (acc, video) => acc.concat(video.comments),
      [],
    );

    await Channel.findByIdAndUpdate(
      channelData._id,
      { sponsors: sponsorsId._id, comments: commentId._id },
      { new: true, select: '_id' },
    );

    if (!channelData)
      await Channel.findByIdAndUpdate(channelData._id, { sponsors: [] });

    if (!channelData) return next(new AppError(`Data Not Found!`, 404));
    // if (!channelData.section) channelData.section = [];

    return res.status(201).json({
      status: 'Success',
      data: channelData,
    });
  } catch (err) {
    console.log(`CREATE CHANNEL | CHANNELS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = createChannel;
