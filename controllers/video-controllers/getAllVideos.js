/**
 * @fileoverview Video listing endpoint
 * @module controllers/video-controllers/getAllVideos
 * @layer Controller
 *
 * @description
 * Retrieves all video documents across all channels. Collects all channel IDs
 * and queries videos whose channel field matches any of those IDs.
 *
 * @dependencies
 * - Upstream: video route handler
 * - Downstream: Channel model, Video model, AppError, catchAsync
 */
const Channel = require('../../models/channelModel');
const Video = require('../../models/videoModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const getAllVideos = catchAsync(async (req, res, next) => {
  try {
    const channels = await Channel.find();
    // console.log(`CHANNELS:`, channels);

    const allIds = channels.map((item) => item._id);

    // console.log(`ALL IDS:`, allIds);
    const data = await Video.find({ channel: allIds });

    // console.log(`DATA:`, data);
    if (!data)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));
    return res.status(200).json({
      status: 'Success',
      results: data.length,
      data,
    });
  } catch (err) {
    console.log(`GET ALL VIDEOS | VIDEO CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getAllVideos;
