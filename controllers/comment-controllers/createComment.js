const Comment = require('../../models/commentModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const Video = require('../../models/videoModel');
const Channel = require('../../models/channelModel');

const createComment = catchAsync(async (req, res, next) => {
  try {
    const videoData = await Video.findById(req.params.videoId);
    // console.log(videoData);
    const userChannel = req.user.channel ? req.user.channel._id : null;
    const userId = req.user._id;
    const commentData = await Comment.create({
      comment: req.body.comment,
      video: req.params.videoId,
      channel: userChannel,
      user: userId,
      time: Date.now(),
    });

    if (!commentData.video) return next(new AppError(`Video Not Found!`, 404));

    const video = Video.findById(req.params.videoId);
    if (!video.comments) {
      video.comments = [];
    }

    if (!commentData)
      return next(new AppError(`Comment creation failed!`, 500));

    // const video = await Video.findById(req.params.videoId);
    await Channel.findByIdAndUpdate(
      videoData.channel._id,
      { comments: commentData._id },
      { new: true, select: '_id' },
    );

    const updatedVideo = await Video.findByIdAndUpdate(
      videoData._id,
      { $push: { comments: commentData._id } },
      { new: true },
    );

    if (!commentData) next(new AppError(`Data Not Found!`, 404));

    return res.status(201).json({
      status: 'Success',
      data: commentData,
      updatedVideo,
    });
  } catch (err) {
    console.log(`CREATE COMMENT | COMMENTS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = createComment;
