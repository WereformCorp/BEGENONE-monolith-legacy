// const mongoose = require('mongoose');
const fs = require('fs');
const multer = require('multer');
const Channel = require('../models/channelModel');
const User = require('../models/userModel');
const Video = require('../models/videoModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerController');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const destinationFolder =
//       file.fieldname === 'displayImage' ? 'users' : 'banners';
//     // cb(null, `public/imgs/${destinationFolder}`);
//     cb(null, `public/imgs/users/${req.user._id}/${destinationFolder}`);
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     const fieldName = file.fieldname;

//     // Remove the old file before saving the new one
//     if (req.user.channel[fieldName]) {
//       const oldFilePath = `public/imgs/users/${req.user._id}/${fieldName}s/${req.user.channel[fieldName]}`;
//       fs.unlinkSync(oldFilePath);
//     }

//     cb(null, `${fieldName}-${req.user.channel._id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationFolder =
      file.fieldname === 'displayImage' ? 'display-images' : 'banner-images';
    const userFolderPath = `public/imgs/users/${req.user._id}`;
    const finalDestination = `${userFolderPath}/${destinationFolder}`;

    // Check if the user folder exists, create it if not
    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath);
    }

    // Check if the destination folder exists, create it if not
    if (!fs.existsSync(finalDestination)) {
      fs.mkdirSync(finalDestination);
    }

    cb(null, finalDestination);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    const fieldName = file.fieldname;

    // Remove the old file before saving the new one
    if (req.user.channel[fieldName]) {
      const oldFilePath = `public/imgs/users/${req.user._id}/${fieldName}s/${req.user.channel[fieldName]}`;
      fs.unlinkSync(oldFilePath);
    }

    cb(null, `${fieldName}-${req.user.channel._id}-${Date.now()}.${ext}`);
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
  storage: multerStorage,
  fileFilter: multerFilter,
});

// const uploadBanner = multer({
//   storage: multerStorageBanner,
//   fileFilter: multerFilter,
// });

exports.uploadImages = upload.fields([
  { name: 'displayImage', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 },
]);
// exports.uploadChannelBanner = uploadBanner.single('banner');

exports.getAllChannels = factory.getAll(Channel);
exports.getChannel = factory.getOne(Channel);
exports.deleteChannel = factory.deleteOne(Channel);
exports.getAllChannels = factory.getAll(Channel);
exports.updateChannel = catchAsync(async (req, res, next) => {
  try {
    // Create the update object
    const updateObject = { ...req.body };

    // If req.file is present, add displayImage to updateObject
    // if (req.files) {
    //   // Check if displayImage is provided
    //   if (req.files.displayImage) {
    //     updateObject.displayImage = req.files.displayImage[0].filename;
    //   }

    //   // Check if bannerImage is provided
    //   if (req.files.bannerImage) {
    //     updateObject.bannerImage = req.files.bannerImage[0].filename;
    //   }
    // }

    if (req.files) {
      // Loop through each uploaded file
      Object.keys(req.files).forEach((fieldname) => {
        const uploadedFile = req.files[fieldname][0];

        // Check if the file is a displayImage or bannerImage
        if (fieldname === 'displayImage' || fieldname === 'bannerImage') {
          // Remove the old file before saving the new one
          if (req.user.channel[fieldname]) {
            const oldFilePath = `public/imgs/users/${req.user._id}/${fieldname}s/${req.user.channel[fieldname]}`;
            fs.unlinkSync(oldFilePath);
          }

          // Update the corresponding field in updateObject
          updateObject[fieldname] = uploadedFile.filename;
        }
      });
    }

    const channelData = await Channel.findByIdAndUpdate(
      req.user.channel._id,
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
      { channel: channelData._id },
      { new: true },
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
