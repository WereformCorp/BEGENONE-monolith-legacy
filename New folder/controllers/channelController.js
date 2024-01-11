// const mongoose = require('mongoose');
const multer = require('multer');
const Channel = require('../models/channelModel');
const User = require('../models/userModel');
const Video = require('../models/videoModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerController');

const multerStorageDP = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/imgs/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.channel._id}-${Date.now()}.${ext}`);
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

exports.uploadUserPhoto = upload.single('displayImage');

exports.getAllChannels = factory.getAll(Channel);
exports.getChannel = factory.getOne(Channel);
exports.deleteChannel = factory.deleteOne(Channel);
exports.getAllChannels = factory.getAll(Channel);

// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach((el) => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };

exports.updateChannel = catchAsync(async (req, res, next) => {
  try {
    // Create the update object
    const updateObject = { ...req.body };

    // If req.file is present, add displayImage to updateObject
    if (req.file) {
      updateObject.displayImage = req.file.filename;
    }

    // const filteredBody = filterObj(req.body, 'name', 'email');
    // if (req.file) filteredBody.photo = req.file.filename;

    const channelData = await Channel.findByIdAndUpdate(
      req.params.id,
      updateObject,
      {
        new: true,
      },
    );

    if (!channelData)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));

    return res.status(200).json({
      status: 'Success',
      data: channelData,
    });
  } catch (err) {
    return res.json({
      status: 'fail',
      message: err.message,
      err,
    });
  }
});
exports.createChannel = catchAsync(async (req, res, next) => {
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
      {
        channel: channelData._id,
      },
      { new: true, select: '_id' },
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
    return res.json({
      status: 'fail',
      message: err.message,
      err,
    });
  }
});
