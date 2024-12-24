const express = require('express');
const multer = require('multer');

// const videoController = require('../controllers/videoController');
// const sponsorRouter = require('./sponsorRoutes');
const commentRouter = require('./commentRoutes');
// const authController = require('../controllers/authController');
// const checkActiveStatus = require('../utils/checkActiveStatus');
const {
  // checkSubscription,
  checkUserSubscription,
} = require('../controllers/util-controllers/checkSubscription');
// const { uploadContentToS3 } = require('../controllers/aws_S3_controller');
const protect = require('../controllers/auth-controllers/protect');
const uploadThumbnailFunction = require('../controllers/util-controllers/uploadThumbnailFunction');
const authMiddleware = require('../controllers/util-controllers/authMiddleware');
const s3UploadVideo = require('../controllers/video-controllers/s3UploadVideo');
const updateLikesDislikes = require('../controllers/video-controllers/updateLikesDislikes');
const getVideo = require('../controllers/video-controllers/getVideo');
const updateVideo = require('../controllers/video-controllers/updateVideo');
const deleteVideo = require('../controllers/video-controllers/deleteVideo');
const getAllVideos = require('../controllers/video-controllers/getAllVideos');
const getThumbnailData = require('../controllers/video-controllers/getThumbnailData');

const router = express.Router({ mergeParams: true });

let thumbnailImage;

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route('/thumbnail')
  .get(getThumbnailData)
  .post(
    protect,
    upload.single('thumbnail'),
    uploadThumbnailFunction,
    async (req, res) => {
      thumbnailImage = req.thumbnail;
    },
  );

router
  .route('/')
  .get(getAllVideos)
  .post(
    protect,
    // checkSubscription,
    checkUserSubscription,
    authMiddleware,
    upload.single('video'),
    async (req, res, next) => {
      req.thumbnailImage = thumbnailImage || null;

      next();
    },
    s3UploadVideo,
  );

router
  .route('/interaction/:videoId/:action')
  .patch(protect, updateLikesDislikes);

router
  .route('/:id')
  .get(getVideo)
  .patch(protect, updateVideo)
  .delete(protect, deleteVideo);

// router.use('/:videoId/sponsors', sponsorRouter);
router.use('/:videoId/comments', commentRouter);

module.exports = router;

// 1) Create a api/v1/videos/thumbnail route and send the thumbnail in to this.
// 2) Pass the "RESPONSE" of this thumbnail POST route as a middleware after authMiddleware.
// 4) Use the thumbnail data from the RESPONSE in AWS S3 Controller.
// 5) Pass the RESPONSE data from AWS S3 into videoController.createVideo -> Request/Response

// // MUST CHANGE THE ROUTES IN UPLOAD-VIDEO.JS

// let getThumbnail = {};

// const uploadThumbnailFunction = (req, res) => {
//   if (req.file) {
//     console.log(`THUMBNAIL FILES FROM ROUTE: /THUMBNAIL =`, req.file);

//     // Save the uploaded thumbnail file in the request object for use later
//     getThumbnail.thumb = req.file;

//     console.log(`getTHUMBNAIL . THUMB FUNCTION:`, getThumbnail.thumb);
//     return res.status(200).json({
//       status: 'success',
//       file: req.file,
//     });
//   }
//   // If no thumbnail uploaded, skip and move forward
//   console.log('No thumbnail uploaded.');
//   req.thumbnail = null; // Explicitly set to null
//   res.status(200).json({
//     status: 'success',
//     message: 'No thumbnail uploaded, proceeding without it.',
//     file: undefined,
//   });
// };

// VIDEO ROUTING _____________________ OLD
// upload.single('video'),
// async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('Video Routes: No file uploaded');
//   }

//   try {
//     const channelId = req.user.channel; // Get channel ID from request
//     const result = await uploadVideoToS3(req.file, channelId, 'video');
//     console.log(result.result);

//     req.file.s3Data = result;

//     return videoController.createVideo(req, res);

//     // res.send({
//     //   message: 'File uploaded successfully',
//     //   fileUrl: result.result, // This is the URL where the file is accessible in S3
//     //   // channelId,
//     // });
//   } catch (error) {
//     console.error('Upload Error:', error);
//     res.status(500).send('File upload failed');
//   }
//   console.log('FINALLY REACHED THE END OF THIS FUNCTION! 🥳🥳🥳🥳');
// },
// upload.fields([
//   { name: 'video', maxCount: 1 },
//   { name: 'thumbnail', maxCount: 1 },
// ]),

//////////////////////////////////////////////////////////// ------------------ END OF VIDEO ROUTING

// router
//   .route('/thumbnail/')
//   .post(
//     authController.protect,
//     authMiddleware,
//     upload.single('thumbnail'),
//     async (req, res) => {
//       try {
//         const channelId = req.user.channel;
//         const result = await uploadFileToS3(req.file, channelId, 'thumbnail');

//         console.log(result.result);

//         req.file.s3Data = result;

//         return videoController.createThumb(req, res);
//       } catch (err) {
//         console.log(err);
//       }
//     },
//   );

// router.route('/stream/:id').get(
//   videoController.streamVideo,
// async (req, res) => {
//   const { id } = req.params;

//   try {
//     const url = await generatePresignedUrl(id);
//     res.json({ url });
//   } catch (error) {
//     res.status(500).json({ message: 'Error generating URL' });
//   }
// },
// // videoController.streamVideo
// );

// ----------------------------------------

// router.get('/video-url/:key', async (req, res) => {
//   const { key } = req.params;

//   try {
//     const url = await generatePresignedUrl(key);
//     res.json({ url });
//   } catch (error) {
//     res.status(500).json({ message: 'Error generating URL' });
//   }
// });

// async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No files uploaded');
//   }

//   try {
//     // const channelId = req.user.channel; // Get channel ID from request
//     const channelId = res.locals.user.channel; // Get channel ID from request
//     console.log(`CHANNEL ID FROM VIDEO ROUTES:`, channelId);
//     let thumbnailResult;

//     const videoResult = await uploadContentToS3(
//       req.file,
//       channelId,
//       'video',
//     );
//     console.log('Video uploaded:', videoResult.result);

//     if (getThumbnail && getThumbnail.thumb) {
//       thumbnailResult = await uploadContentToS3(
//         getThumbnail.thumb,
//         channelId,
//         'thumbnail',
//       );
//       console.log('Thumbnail Upload Result:', thumbnailResult);
//     }

//     console.log(
//       `getTHUMBNAIL . THUMB FUNCTION --- VIDEO UPLOAD 🔥🔥🔥🔥:`,
//       getThumbnail,
//     );
//     console.log(
//       `getTHUMBNAIL . THUMB FUNCTION --- VIDEO UPLOAD 2 🔥🔥:`,
//       getThumbnail.thumb,
//     );

//     // if (thumbnailResult) {
//     //   req.s3Data = {
//     //     thumbnail: thumbnailResult || undefined,
//     //   };
//     // }

//     req.s3Data = {
//       video: videoResult || null,
//       thumbnail: thumbnailResult || null,
//     };

//     console.log(`REQUEST S3-DATA:`, req.s3Data);

//     return videoController.createVideo(req, res);
//   } catch (error) {
//     console.error('Upload Error:', error);
//     res.status(500).send('File upload failed');
//   }
// },
