// const mongoose = require('mongoose');
const fs = require('fs');
const multer = require('multer');
const Channel = require('../models/channelModel');
const User = require('../models/userModel');
const Video = require('../models/videoModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerController');

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

// exports.uploadChannelPfp = catchAsync(async (req, res, next) => {
//   try {
//     const ImageFileData = req.s3Data;
//     const { channel } = res.locals.user;
//     const channelData = await Channel.findById(channel);
//     await Channel.findByIdAndUpdate(
//       channelData._id,
//       {
//         channelLogo: ImageFileData.profilepic
//           ? ImageFileData.profilepic.key
//           : undefined,
//       },
//       { new: true },
//     );

//     console.log(`CHANNEL FROM CONTROLLER:`, channel);
//     return res.json({
//       data: channel._id,
//     });
//   } catch (err) {
//     return new AppError(`There was an Error ${err}`, 500);
//   }
// });

exports.uploadChannelPfp = catchAsync(async (req, res, next) => {
  try {
    // Extract necessary data
    const ImageFileData = req.s3Data; // Contains the uploaded image's S3 data
    const { channel } = res.locals.user; // Channel ID from middleware

    if (!ImageFileData || !ImageFileData.profilepic) {
      return next(new AppError('No profile picture uploaded', 400));
    }

    // Update the channel document
    const updatedChannel = await Channel.findByIdAndUpdate(
      channel, // Use channel ID directly
      {
        channelLogo: ImageFileData.profilepic.key, // S3 key for the uploaded image
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Enforce validation rules
      },
    );

    if (!updatedChannel) {
      return next(new AppError('Channel not found', 404));
    }

    console.log(`Updated Channel:`, updatedChannel);

    // Respond with success
    return res.status(200).json({
      message: 'Profile picture updated successfully',
      data: updatedChannel._id,
    });
  } catch (err) {
    console.error(`Error in uploadChannelPfp:`, err);
    return next(new AppError(`There was an Error: ${err.message}`, 500));
  }
});

exports.uploadChannelBanner = catchAsync(async (req, res, next) => {
  try {
    // Extract necessary data
    const ImageFileData = req.s3Data; // Contains the uploaded image's S3 data
    const { channel } = res.locals.user; // Channel ID from middleware

    if (!ImageFileData || !ImageFileData.banner) {
      return next(new AppError('No profile picture uploaded', 400));
    }

    // Update the channel document
    const updatedChannel = await Channel.findByIdAndUpdate(
      channel, // Use channel ID directly
      {
        bannerImage: ImageFileData.banner.key, // S3 key for the uploaded image
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Enforce validation rules
      },
    );

    if (!updatedChannel) {
      return next(new AppError('Channel not found', 404));
    }

    return res.json({
      status: 'success',
      data: updatedChannel,
    });
  } catch (err) {
    console.error(`Error in uploadChannelBanner:`, err);
    return next(new AppError(`There was an Error: ${err.message}`, 500));
  }
});

exports.getAllChannels = factory.getAll(Channel);
exports.getChannel = catchAsync(async (req, res, next) => {
  try {
    const data = await Channel.findById(req.params.id);
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
exports.deleteChannel = factory.deleteOne(Channel);
exports.getAllChannels = factory.getAll(Channel);
exports.updateChannel = catchAsync(async (req, res, next) => {
  try {
    // Create the update object
    const updateObject = { ...req.body };
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
      subscribers: req.body.subscribers,
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
