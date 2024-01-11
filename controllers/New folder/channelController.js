// const mongoose = require('mongoose');
// const multer = require('multer');
const Channel = require('../models/channelModel');
const User = require('../models/userModel');
const Video = require('../models/videoModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerController');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/imgs/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new AppError(`Not an image! Please upload only images.`, 400), false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

// exports.uploadUserPhoto = upload.single('displayImage');

exports.getAllChannels = factory.getAll(Channel);
exports.getChannel = factory.getOne(Channel);
exports.updateChannel = factory.updateOne(Channel);
exports.deleteChannel = factory.deleteOne(Channel);
exports.createChannel = catchAsync(async (req, res, next) => {
  try {
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
      sponsors: [req.body.sponsors],
      story: req.body.story,
    });

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

    await Channel.findByIdAndUpdate(
      channelData._id,
      { sponsors: sponsorsId._id },
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
