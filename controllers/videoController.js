const multer = require('multer');

const Notification = require('../models/notificationModel');
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

const uploadThumb = multer({
  storage: multerStorageDP,
  fileFilter: multerFilter,
}).single('thumbnail');

exports.uploadThumbnail = uploadThumb;

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
}).single('video');

exports.uploadVidFile = uploadVid;

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
    const videoData = {
      title: req.body.title,
      description: req.body.description,
      // thumbnail: req.file ? req.file.filename : req.body.thumbnail,
      section: req.body.section,
      channel: req.user.channel._id,
      bookmark: req.body.bookmark,
      sponsors: req.body.sponsors,
      comments: req.body.comments,
      audio: req.body.audio,
      video: req.file.filename,
      user: req.user.id,
      time: Date.now(),
    };

    // console.log(await Notification.create());

    const createdVideo = await Video.create(videoData);

    if (!req.file) videoData.thumbnail = req.body.thumbnail;
    if (req.file) videoData.thumbnail = req.file.filename;

    // Gets the Id of the Video from the videoData and Updates the channel's Video Field "videoData._id".
    const updatedChannel = await Channel.findByIdAndUpdate(
      req.user.channel._id,
      { $push: { videos: createdVideo._id } },
      { new: true },
    );

    console.log(updatedChannel.subscribers);

    // Get the subscribers of the channel
    const subscribers = updatedChannel.subscribers || [];

    // Create notifications for each subscriber
    const mapNotification = subscribers.map((subscriberId) => ({
      userId: subscriberId,
      channelId: req.user.channel._id,
      videoId: createdVideo._id,
    }));

    // Save the notifications to the database
    const notifications = await Notification.create(mapNotification);
    console.log(
      `FULL NOTIFICATION:`,
      notifications,
      // `NOTIFICATIONS: ${notifications}`,
      // `VIDEO ID: ${createdVideo._id}`,
      // `CHANNEL ID: ${req.user.channel._id}`,
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
    res.json({
      status: 'fail',
      message: err.message,
      err,
    });
  }
});

exports.updateLikesDislikes = catchAsync(async (req, res, next) => {
  const { videoId } = req.params;
  const userId = req.user._id;
  const { action } = req.params; // 'like', 'dislike', or 'remove'

  // Find the video by its ID
  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).json({
      status: 'fail',
      message: 'Video not found',
    });
  }

  // Check if the user already liked the video
  const userLiked = video.likedBy.includes(userId);
  const userDisliked = video.dislikedBy.includes(userId);

  if (action === 'like') {
    if (userLiked) {
      // If the user already liked, remove the like
      video.likes -= 1;
      const index = video.likedBy.indexOf(userId);
      video.likedBy.splice(index, 1);
    } else {
      // Increment the likes count
      video.likes += 1;

      // Add the user to the likedBy array
      video.likedBy.push(userId);

      // If the user already disliked, remove the dislike
      if (userDisliked) {
        video.dislikes -= 1;
        const index = video.dislikedBy.indexOf(userId);
        video.dislikedBy.splice(index, 1);
      }
    }
  } else if (action === 'dislike') {
    if (userDisliked) {
      // If the user already disliked, remove the dislike
      video.dislikes -= 1;
      const index = video.dislikedBy.indexOf(userId);
      video.dislikedBy.splice(index, 1);
    } else {
      // Increment the dislikes count
      video.dislikes += 1;

      // Add the user to the dislikedBy array
      video.dislikedBy.push(userId);

      // If the user already liked, remove the like
      if (userLiked) {
        video.likes -= 1;
        const index = video.likedBy.indexOf(userId);
        video.likedBy.splice(index, 1);
      }
    }
  }
  // else if (action === 'remove') {
  //   // Handle removing the like or dislike
  //   if (userLiked) {
  //     video.likes -= 1;
  //     const index = video.likedBy.indexOf(userId);
  //     video.likedBy.splice(index, 1);
  //   } else {
  //     // Handle removing dislikes similarly
  //     // ...
  //   }
  // }

  // Save the updated video
  await video.save();

  // Respond with the updated likes and dislikes count
  res.status(200).json({
    status: 'success',
    likes: video.likes,
    dislikes: video.dislikes,
    userLiked: video.likedBy.includes(userId),
    userDisliked: video.dislikedBy.includes(userId),
  });
});
