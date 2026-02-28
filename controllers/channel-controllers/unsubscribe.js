/**
 * @fileoverview Channel unsubscription with bidirectional reference cleanup
 * @module controllers/channel-controllers/unsubscribe
 * @layer Controller
 *
 * @description
 * Unsubscribes the authenticated user from a channel identified via a video's
 * channel reference. Performs a bidirectional cleanup: pulls the channel ID from
 * the user's subscribedChannels array and pulls the user ID from the channel's
 * subscribers array. Prevents self-unsubscription.
 *
 * @dependencies
 * - Upstream: channel route handler (authenticated)
 * - Downstream: Channel model, User model, Video model, catchAsync
 */
const Channel = require('../../models/channelModel');
const User = require('../../models/userModel');
const Video = require('../../models/videoModel');
const catchAsync = require('../../utils/catchAsync');

/**
 * Unsubscribes the authenticated user from the channel associated with the given video.
 * Resolves the channel from the video's populated channel field, then performs
 * idempotent $pull on both User.subscribedChannels and Channel.subscribers.
 * @param {import('express').Request} req - Express request with params.id (video ID) and user._id
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next middleware
 */
const unsubscribe = catchAsync(async (req, res, next) => {
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
    console.log(`UNSUBSCRIBE | CHANNELS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = unsubscribe;
