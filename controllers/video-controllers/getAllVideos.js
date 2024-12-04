const Channel = require('../../models/channelModel');
const Video = require('../../models/videoModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const getAllVideos = catchAsync(async (req, res, next) => {
  try {
    const channels = await Channel.find();
    const allIds = channels.map((item) => item._id);
    const data = await Video.find({ channel: allIds });
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
