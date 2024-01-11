// const mongoose = require('mongoose');
const multer = require('multer');
const Channel = require('../models/channelModel');
const Video = require('../models/videoModel');
// const Comment = require('../models/commentModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerController');

// const { ObjectId } = mongoose.Types;

const multerStorageDP = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/imgs/thumbnails');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `thumbnail-${req.user.channel._id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError(`Not an image! Please upload only images.`, 400), false);
  }
};

const upload = multer({
  storage: multerStorageDP,
  fileFilter: multerFilter,
});

exports.uploadThumbnail = upload.single('thumbnail');

// exports.getAllVideos = factory.getAll(Video);
exports.getVideo = factory.getOne(Video);
// exports.updateVideo = factory.updateOne(Video);
exports.deleteVideo = factory.deleteOne(Video);

exports.updateVideo = catchAsync(async (req, res, next) => {
  try {
    const data = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (req.file) {
      data.displayImage = req.file.filename;
    }

    if (!data)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));

    return res.status(200).json({
      status: 'Success',
      data,
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err.message,
      err,
    });
  }
});

exports.getAllVideos = catchAsync(async (req, res, next) => {
  try {
    const channels = await Channel.find();

    const allIds = channels.map((item) => item._id);
    // console.log(allIds);

    const data = await Video.find({ channel: allIds });

    // const comment = await Comment.find({ video: ObjectId(data._id) });

    // console.log(comment);

    // if (!data.channel.id) data.select = false;
    // const data = await Video.find({ channel: req.user.channel.id });
    if (!data)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));
    return res.status(200).json({
      status: 'Success',
      results: data.length,
      data,
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err.message,
      err,
    });
  }
});

exports.createVideo = catchAsync(async (req, res, next) => {
  try {
    const videoData = {
      title: req.body.title,
      description: req.body.description,
      thumbnail: req.body.thumbnail,
      section: req.body.section,
      channel: req.user.channel._id,
      bookmark: req.body.bookmark,
      sponsors: req.body.sponsors,
      comments: req.body.comments,
      audio: req.body.audio,
      video: req.body.video,
      user: req.user.id,
      time: Date.now(),
    };

    // const updateObject = { ...req.body };

    // If req.file is present, add displayImage to updateObject
    if (req.file) {
      videoData.thumbnail = req.file.filename;
    }

    const createdVideo = await Video.create(videoData);

    if (!req.file) videoData.thumbnail = req.body.thumbnail;
    if (req.file) videoData.thumbnail = req.file.filename;

    // Gets the Id of the Video from the videoData and Updates the channel's Video Field "videoData._id".
    await Channel.findByIdAndUpdate(
      req.user.channel._id,
      { $push: { videos: createdVideo._id } },
      { new: true, select: '_id' },
    );

    // console.log(req.user.channel.displayImage);

    if (!createdVideo) {
      return next(new AppError(`Data Not Found!`, 404));
    }

    // If No Video Data - Then Videos Array Should Be Empty
    if (!videoData)
      await Channel.findByIdAndUpdate(req.user.channel._id, { video: [] });

    // If No Video Data - Then Return Error Message: Data Not Found
    if (!createdVideo) return next(new AppError(`Data Not Found!`, 404));

    // If No Section in Video Data - Then Section Array in Video Data should be empty
    if (!createdVideo.section) videoData.section = [];

    // If There is Video Data, Send a Response
    if (videoData)
      return res.status(201).json({
        status: 'Success',
        data: createdVideo,
      });
  } catch (err) {
    console.log(err, err.message);
  }
});
