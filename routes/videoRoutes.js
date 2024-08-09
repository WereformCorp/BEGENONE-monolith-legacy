const express = require('express');

const multer = require('multer');

const videoController = require('../controllers/videoController');
const sponsorRouter = require('./sponsorRoutes');
const commentRouter = require('./commentRoutes');
const authController = require('../controllers/authController');
const {
  uploadThumbVideoToS3,
  uploadVideoToS3,
  uploadThumbToS3,
  streamVideoFromS3,
  generatePresignedUrl,
} = require('../controllers/aws_S3_controller');

const router = express.Router({ mergeParams: true });

const authMiddleware = (req, res, next) => {
  // Simulate user and channel ID in req.user
  const userChannel = req.user.channel;
  // req.user = { channel: { _id: '1234567890' } };
  console.log(`GETTING THE USER CHANNEL:`, userChannel);
  next();
};

// router.post(
//   '/thumbnail',
//   authController.protect,
//   authMiddleware,
//   videoController.finalizeThumb,
// );

// router.route('/').get(videoController.getAllVideos);
// .post(
//   authController.protect,
//   videoController.uploadVidFile,
//   videoController.createVideo,
// );

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route('/')
  .get(videoController.getAllVideos)
  .post(
    authController.protect,
    authMiddleware,
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
    upload.fields([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
    async (req, res) => {
      if (!req.files.video) {
        return res.status(400).send('No files uploaded');
      }

      try {
        const channelId = req.user.channel; // Get channel ID from request

        let videoResult;
        let thumbnailResult;

        if (req.files.video) {
          videoResult = await uploadThumbVideoToS3(
            req.files.video[0],
            channelId,
            'video',
          );
          console.log('Video uploaded:', videoResult.result);
        }

        if (req.files.thumbnail) {
          thumbnailResult = await uploadThumbVideoToS3(
            req.files.thumbnail[0],
            channelId,
            'thumbnail',
          );
          console.log('Thumbnail uploaded:', thumbnailResult.result);
        }

        req.files.s3Data = {
          video: videoResult || null,
          thumbnail: thumbnailResult || undefined,
        };

        return videoController.createVideo(req, res);
      } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).send('File upload failed');
      }
    },
  );

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

router
  .route('/interaction/:videoId/:action')
  .patch(authController.protect, videoController.updateLikesDislikes);

router
  .route('/:id')
  .get(
    videoController.getVideo,
    // async (req, res) => {
    // const { videoKey } = req;
    // console.log(`VIDEO KEY FROM ROUTER: ${videoKey}`);
    // await streamVideoFromS3(videoKey, res);
    // }
  )
  .patch(authController.protect, videoController.updateVideo)
  .delete(authController.protect, videoController.deleteVideo);

router.route('/stream/:id').get(
  videoController.streamVideo,
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
);
// router.get('/video-url/:key', async (req, res) => {
//   const { key } = req.params;

//   try {
//     const url = await generatePresignedUrl(key);
//     res.json({ url });
//   } catch (error) {
//     res.status(500).json({ message: 'Error generating URL' });
//   }
// });

router.use('/:videoId/sponsors', sponsorRouter);
router.use('/:videoId/comments', commentRouter);

module.exports = router;
