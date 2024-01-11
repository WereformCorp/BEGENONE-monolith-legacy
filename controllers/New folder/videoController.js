// const mongoose = require('mongoose');
const Video = require('../models/videoModel');
const Channel = require('../models/channelModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerController');

exports.getAllVideos = factory.getAll(Video);
exports.getVideo = factory.getOne(Video);
exports.updateVideo = factory.updateOne(Video);
exports.deleteVideo = factory.deleteOne(Video);
exports.createVideo = catchAsync(async (req, res, next) => {
  try {
    const videoData = await Video.create({
      title: req.body.title,
      description: req.body.description,
      thumbnail: req.body.thumbnail,
      section: req.body.section,
      channel: req.user.channel._id,
      bookmark: req.body.bookmark,
      sponsors: req.body.sponsors,
      comments: req.body.comments,
      audio: req.body.audio,
      videos: req.body.videos,
      user: req.user.id,
    });

    // Gets the Id of the Video from the videoData and Updates the channel's Video Field "videoData._id".
    await Channel.findByIdAndUpdate(
      req.user.channel._id,
      { videos: videoData._id },
      { new: true, select: '_id' },
    );

    // If No Video Data - Then Videos Array Should Be Empty
    if (!videoData)
      await Channel.findByIdAndUpdate(req.user.channel._id, { videos: [] });

    // If No Video Data - Then Return Error Message: Data Not Found
    if (!videoData) return next(new AppError(`Data Not Found!`, 404));

    // If No Section in Video Data - Then Section Array in Video Data should be empty
    if (!videoData.section) videoData.section = [];

    // If There is Video Data, Send a Response
    if (videoData)
      return res.status(201).json({
        status: 'Success',
        data: videoData,
      });
  } catch (err) {
    console.log(err, err.message);
  }
});
