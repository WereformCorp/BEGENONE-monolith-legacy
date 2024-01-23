const Channel = require('../models/channelModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.subscribe = catchAsync(async (req, res, next) => {
  const userId = res.locals.user;
  const requestedChannel = await Channel.findById(req.params.id);
  if (!requestedChannel.subscribers.includes(userId._id)) {
    // If not subscribed, update the channel's subscribers array
    await Channel.findByIdAndUpdate(requestedChannel, {
      $push: { subscribers: userId },
    });
    await User.findByIdAndUpdate(userId._id, {
      $push: {
        subscribedChannels: requestedChannel,
        $inc: { subscribersCount: 1 },
      },
    });

    res.status(200).json({
      status: 'success',
      data: requestedChannel,
    });
  } else
    res.status(200).json({
      status: 'success',
      message: 'THE CHANNEL ALREADY EXISTS',
      data: requestedChannel,
    });
});
