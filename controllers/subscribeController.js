const Channel = require('../models/channelModel');
const User = require('../models/userModel');
const Video = require('../models/videoModel');
const catchAsync = require('../utils/catchAsync');

exports.subscribe = catchAsync(async (req, res, next) => {
  try {
    const loggedInUser = await User.findById(req.user._id);
    const videoChannel = await Video.findById(req.params.id).populate({
      path: 'channel',
      select: '_id name',
    });
    const requestedChannel = await Channel.findById(videoChannel.channel._id);
    if (loggedInUser.channel)
      if (loggedInUser.channel._id.equals(requestedChannel._id)) {
        return res.status(403).json({
          status: 'fail',
          message: 'You cannot subscribe to your own channel.',
        });
      }
    if (!loggedInUser.subscribedChannels.includes(videoChannel.channel._id))
      await User.findByIdAndUpdate(loggedInUser._id, {
        $push: {
          subscribedChannels: videoChannel.channel._id,
        },
      });
    if (!requestedChannel.subscribers.includes(loggedInUser._id)) {
      // If not subscribed, update the channel's subscribers array
      await Channel.findByIdAndUpdate(requestedChannel._id, {
        $push: { subscribers: loggedInUser._id },
      });

      res.status(200).json({
        status: 'success',
        isSubscribed: true,
      });
    } else
      res.status(200).json({
        status: 'fail',
        message: 'THE CHANNEL ALREADY EXISTS',
      });
  } catch (err) {
    console.log(err.message, err);
  }
});

// /////////////////////////////////////// UNSUBSCRIBE /////////////////////////////////////////////
exports.unsubscribe = catchAsync(async (req, res, next) => {
  try {
    const loggedInUser = await User.findById(req.user._id);
    const videoChannel = await Video.findById(req.params.id).populate({
      path: 'channel',
      select: '_id name',
    });
    const requestedChannel = await Channel.findById(videoChannel.channel._id);
    if (loggedInUser.channel)
      if (loggedInUser.channel._id.equals(requestedChannel._id)) {
        return res.status(403).json({
          status: 'fail',
          message: 'You cannot unsubscribe to your own channel.',
        });
      }
    if (loggedInUser.subscribedChannels.includes(requestedChannel._id))
      await User.findByIdAndUpdate(loggedInUser._id, {
        $pull: {
          subscribedChannels: videoChannel.channel._id,
        },
      });
    if (requestedChannel.subscribers.includes(loggedInUser._id)) {
      // If not subscribed, update the channel's subscribers array
      await Channel.findByIdAndUpdate(requestedChannel._id, {
        $pull: { subscribers: loggedInUser._id },
      });

      res.status(200).json({
        status: 'success',
        isSubscribed: false, // always false after unsubscribing
      });
    } else
      res.status(200).json({
        status: 'fail',
        message: 'THE CHANNEL ALREADY EXISTS',
      });
  } catch (err) {
    console.log(err.message, err);
  }
});
