// const multer = require('multer');
// // eslint-disable-next-line import/no-extraneous-dependencies
// const AWS = require('aws-sdk');
// // eslint-disable-next-line import/no-extraneous-dependencies
// const multerS3 = require('multer-s3');
const axios = require('axios');

// const Notification = require('../models/notificationModel');
const Channel = require('../models/channelModel');
const Video = require('../models/videoModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerController');

/////////// _______________________________ S3 MULTER CONFIGURATION TEST __________________

// // Configure AWS SDK with your credentials and region
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION, // e.g., 'us-west-2'
// });

// // Create an S3 instance
// const s3 = new AWS.S3();

// // Configure Multer to use S3 for storage
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.S3_BUCKET_NAME, // your S3 bucket name
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(null, `${Date.now().toString()}-${file.originalname}`);
//     },
//   }),
// });

// /////////////////////__________ ORIGINAL _____________________________

// const multerStorageDP = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/imgs/thumbnails');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `thumbnail-${req.user.channel._id}-${Date.now()}.${ext}`);
//   },
// });

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new AppError(`Not an image! Please upload only images.`, 400), false);
//   }
// };

// const uploadThumb = multer({
//   storage: multerStorageDP,
//   fileFilter: multerFilter,
// });

// exports.uploadThumbnail = uploadThumb.single('thumbnail');

// const multerStorageVid = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/video/');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `video-${req.user.channel._id}-${Date.now()}.${ext}`);
//   },
// });

// const multerFilterVid = (req, file, cb) => {
//   if (file.mimetype.startsWith('video')) {
//     cb(null, true);
//   } else {
//     cb(new AppError(`Not an video! Please upload only video.`, 400), false);
//   }
// };

// const uploadVid = multer({
//   storage: multerStorageVid,
//   fileFilter: multerFilterVid,
// });

// exports.uploadVidFile = uploadVid.single('video');

// exports.finalizeThumb = catchAsync(async (req, res, next) => {
//   try {
//     console.log(req.file.filename);

//     const thumbFileName = req.file.filename;

//     console.log(thumbFileName);

//     return res.json({
//       thumbnail: thumbFileName,
//     });
//   } catch (err) {
//     res.json({
//       message: err.message,
//       error: err,
//     });
//   }
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === 'thumbnail' && file.mimetype.startsWith('image')) {
//       cb(null, 'public/imgs/thumbnails');
//     } else if (
//       file.fieldname === 'video' &&
//       file.mimetype.startsWith('video')
//     ) {
//       cb(null, 'public/video/');
//     } else {
//       cb(new AppError('Unsupported file type', 400), false);
//     }
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     const prefix = file.fieldname === 'thumbnail' ? 'thumbnail' : 'video';
//     cb(null, `${prefix}-${req.user.channel._id}-${Date.now()}.${ext}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     (file.fieldname === 'thumbnail' && file.mimetype.startsWith('image')) ||
//     (file.fieldname === 'video' && file.mimetype.startsWith('video'))
//   ) {
//     cb(null, true);
//   } else {
//     cb(new AppError('Please upload only images or videos', 400), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
// }).fields([
//   { name: 'thumbnail', maxCount: 1 },
//   { name: 'video', maxCount: 1 },
// ]);

// exports.uploadFiles = upload;

// //////////////// TEMPORARY ________________________________________

// let urlPath;
// if (process.env.NODE_ENV === 'production') {
//   // Use the production domain
//   urlPath = 'https://begenone.com';
//   // eslint-disable-next-line no-else-return
// } else if (process.env.NODE_ENV === 'development') {
//   // Use the req object for development
//   urlPath = `http://localhost:80`;
// }

// //////////////// TEMPORARY ________________________________________

exports.getVideo = catchAsync(async (req, res, next) => {
  try {
    const data = await Video.findById(req.params.id);
    if (!data)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));
    // console.log(data);
    // return data;
    res.status(200).json({
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

// try {
//   // Step 1: Retrieve video metadata from database
//   const videoData = await Video.findById(req.params.id);
//   if (!videoData) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Video not found',
//     });
//   }

//   // Extract the S3 key from the retrieved data
//   const videoKey = videoData.video; // Adjust based on your schema

//   console.log(`WHOLE VIDEO NAMED AS VIDEOKEY: ${videoKey}`);
//   console.log(`RESPONSE ON GET VIDEO: ${res}`);
//   next(videoKey, res);
//   return {
//     vidKey: videoKey, // S3 URL
//     response: res, // Filename used in S3
//   };
//   // Step 2: Stream video from S3 using the retrieved key
//   // await streamVideoFromS3(videoKey, res);
// } catch (error) {
//   console.error('Error retrieving video or streaming:', error);
//   res.status(500).json({
//     status: 'error',
//     message: 'Error retrieving video or streaming',
//   });
// }
// });
exports.deleteVideo = factory.deleteOne(Video);
exports.updateVideo = catchAsync(async (req, res, next) => {
  try {
    const data = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (req.file) {
      data.displayImage = req.file.fieldname;
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
// console.log(req);
const newDate = new Date().toISOString();
console.log('NEW DATE HERE:', newDate);

const formattedDate = new Date(newDate).toLocaleString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false, // 24-hour format
});

console.log('Formatted Date:', formattedDate);

exports.createVideo = catchAsync(async (req, res, next) => {
  console.log(
    `REQUESTION URL FROM CREATION OF VIDEO CONTROLLER: 🔥🔥🔥🔥🔥🔥🔥`,
    req.results,
  );

  try {
    const videoFileData = req.s3Data;

    console.log('Video File Data:', videoFileData.video);

    const videoData = {
      title: req.body.title || `Uploaded At: ${formattedDate}`,
      description: req.body.description,
      thumbnail: videoFileData.thumbnail
        ? videoFileData.thumbnail.key
        : undefined,
      section: req.body.section,
      channel: req.user.channel._id,
      bookmark: req.body.bookmark,
      sponsors: req.body.sponsors,
      comments: req.body.comments,
      audio: req.body.audio,
      // video: req.file.filename,
      video: videoFileData.video.key,

      user: req.user.id,
      time: Date.now(),
    };

    console.log('Video data before creation:', videoData);
    // console.log(videoData.thumbnail);
    console.log(videoFileData.files);

    const createdVideo = await Video.create(videoData);

    // Update the created video record with the thumbnail

    console.log('Created video:', createdVideo);

    // Gets the Id of the Video from the videoData and Updates the channel's Video Field "videoData._id".
    // const updatedChannel =

    // THIS PUSHES THE VIDEOS INTO THE CHANNEL
    await Channel.findByIdAndUpdate(
      req.user.channel._id,
      { $push: { videos: createdVideo._id } },
      { new: true },
    );

    // Get the subscribers of the channel
    // const subscribers = updatedChannel.subscribers || [];

    // Create notifications for each subscriber
    // const mapNotification = subscribers.map((subscriberId) => ({
    //   userId: subscriberId,
    //   channelId: req.user.channel._id,
    //   videoId: createdVideo._id,
    // }));

    // Save the notifications to the database
    // const notifications = await Notification.create(mapNotification);

    if (!createdVideo) {
      return next(new AppError(`Data Not Found!`, 404));
    }

    // If No Video Data - Then Videos Array Should Be Empty
    // if (!videoData)
    //   await Channel.findByIdAndUpdate(req.user.channel._id, { video: [] });

    // If No Video Data - Then Return Error Message: Data Not Found
    if (!createdVideo) return next(new AppError(`Data Not Found!`, 404));

    // If No Section in Video Data - Then Section Array in Video Data should be empty
    if (!createdVideo.section) videoData.section = [];

    // If There is Video Data, Send a Response
    if (videoData) {
      // eslint-disable-next-line no-undef

      return res.status(201).json({
        status: 'Success',
        data: createdVideo,
      });
    }
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

  if (video.likes < 0)
    return new Error(
      `You Cannot Like a Video in Minus, What kinda guy does that? Ik there's probably a bug, just let us know about the error. `,
    );
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

// ///////////////////// STREAM VIDEO FROM S3
// eslint-disable-next-line import/no-useless-path-segments
const {
  // streamVideoFromS3,
  generatePresignedUrl,
  // eslint-disable-next-line import/no-useless-path-segments
} = require('./aws_S3_controller');

exports.streamVideo = catchAsync(async (req, res, next) => {
  try {
    const videoData = await axios.get(
      `${req.protocol}://${req.get('host')}/api/v1/videos/${req.params.id}`,
    );
    // console.log('VIDEO DATA STREAMING:', videoData.data.data);
    const videoKey = videoData.data.data.video;
    // console.log(`VIDEO KEY IS HERE: ${videoKey}`);

    // Stream the video from S3
    // await streamVideoFromS3(videoKey, res);

    // const { id } = req.params;

    try {
      const url = await generatePresignedUrl(videoKey);
      res.json({ url });
    } catch (error) {
      res.status(500).json({ message: 'Error generating URL' });
    }
  } catch (err) {
    console.log(err);
  }
});

exports.getThumbnailData = catchAsync(async (req, res, next) => {
  try {
    // const videoData = await axios.get(`${urlPath}/api/v1/videos/`);
    const videoData = await Video.find();
    // console.log('VIDEO DATA STREAMING:', videoData.data.data);
    // const thumbKey = videoData.data;
    // eslint-disable-next-line array-callback-return
    const thumbnails = videoData.map((video) => video.thumbnail);

    try {
      // Generate pre-signed URLs for each thumbnail
      const urls = await Promise.all(
        thumbnails.map(async (thumbnail) => {
          try {
            const url = await generatePresignedUrl(thumbnail);
            return { thumbnail, url }; // Return an object with thumbnail and its URL
          } catch (error) {
            console.error(`Error generating URL for ${thumbnail}:`, error);
            return { thumbnail, url: null }; // Return null URL in case of error
          }
        }),
      );

      // Send URLs back in the response
      res.json({ urls });
    } catch (error) {
      res.status(500).json({ message: 'Error generating URLs' });
    }

    // try {
    //   let thumbnail;
    //   thumbnails.forEach((item) => {
    //     console.log('Thumbnail:', item.thumbnail);
    //     // eslint-disable-next-line prefer-destructuring
    //     thumbnail = item.thumbnail;
    //     // You can perform other operations with each item here
    //   });

    //   console.log(`Thumbnail IS HERE:`, thumbnails);

    //   // Stream the video from S3
    //   // await streamVideoFromS3(videoKey, res);

    //   // const { id } = req.params;

    //   const url = await generatePresignedUrl(thumbnail);
    //   res.json({ url });
    // } catch (error) {
    //   res.status(500).json({ message: 'Error generating URL' });
    // }
  } catch (err) {
    console.log(err);
  }
});
