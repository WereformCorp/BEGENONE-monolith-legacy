const multer = require('multer');
const Channel = require('../models/channelModel');
const Video = require('../models/videoModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerController');

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

// exports.uploadThumbnail = upload.single('thumbnail');

const multerStorageVid = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/video/');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `video-${req.user.channel._id}-${Date.now()}.${ext}`);
  },
});

const multerFilterVid = (req, file, cb) => {
  if (file.mimetype.startsWith('video')) {
    cb(null, true);
  } else {
    cb(new AppError(`Not an video! Please upload only video.`, 400), false);
  }
};

const uploadVid = multer({
  storage: multerStorageVid,
  fileFilter: multerFilterVid,
});

// exports.uploadVideoFile = uploadVid.single('video');

// Middleware for handling thumbnail upload
exports.handleThumbnailUpload = (req, res, next) => {
  upload.single('thumbnail')(req, res, (err) => {
    if (req.file) {
      if (err) {
        // Handle error, e.g., return an error response
        return res.status(400).json({ status: 'error', message: err.message });
      }
      console.log('Request Image:', req.file);
      // If successful, store the thumbnail filename in req.body.thumbnail
      req.body.thumbnail = req.file ? req.file.filename : null;
    }
  });
  next();
};

// Middleware for handling video upload
exports.handleVideoUpload = (req, res, next) => {
  uploadVid.single('video')(req, res, (err) => {
    if (err) {
      // Handle error, e.g., return an error response
      return res.status(400).json({ status: 'error', message: err.message });
    }
    console.log('Request Video:', req.file);
    // If successful, store the video filename in req.body.video
    req.body.video = req.file ? req.file.filename : null;
    next();
  });
};

exports.getVideo = factory.getOne(Video);
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
    const data = await Video.find({ channel: allIds });
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
    if (!req.file) console.log('REQ.FILE NOT FOUND!!');

    // const uppyFileIDs = JSON.parse(req.body.uppyFileIDs || '[]');

    const videoData = {
      title: req.body.title,
      description: req.body.description,
      // thumbnail: req.file ? req.file.filename : req.body.thumbnail,
      thumbnail: req.body.thumbnail,
      section: req.body.section,
      channel: req.user.channel._id,
      bookmark: req.body.bookmark,
      sponsors: req.body.sponsors,
      comments: req.body.comments,
      audio: req.body.audio,
      video: req.body.video,
      // video:
      //   uppyFileIDs
      //     .filter((file) => file.field === 'video')
      //     .map((file) => file.id)[0] || null,
      // thumbnail:
      //   uppyFileIDs
      //     .filter((file) => file.field === 'thumbnail')
      //     .map((file) => file.id)[0] || null,
      user: req.user.id,
      time: Date.now(),
    };

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
