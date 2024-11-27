const express = require('express');
const multer = require('multer');
const channelController = require('../controllers/channelController');
const subscribeController = require('../controllers/subscribeController');
const authController = require('../controllers/authController');

const { uploadContentToS3 } = require('../controllers/aws_S3_controller');

const router = express.Router({ mergeParams: true });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const authMiddleware = (req, res, next) => {
  const userChannel = req.user.channel;
  console.log(`GETTING THE USER CHANNEL:`, userChannel);
  next();
};

router
  .route('/banner')
  .post(
    authController.protect,
    authMiddleware,
    upload.single('banner'),
    async (req, res) => {
      if (!req.file) {
        return res.status(400).send('No files uploaded');
      }

      try {
        const channelId = res.locals.user.channel; // Get channel ID from request
        console.log(`CHANNEL ID FROM VIDEO ROUTES:`, channelId);

        const imageResult = await uploadContentToS3(
          req.file,
          channelId,
          'image',
        );
        req.s3Data = {
          banner: imageResult || null,
        };

        console.log(`s3Data FROM /PROFILEPIC`, req.s3Data);
        return channelController.uploadChannelBanner(req, res);

        // return videoController.createVideo(req, res);
      } catch (err) {
        console.log(`ERROR FROM CHANNEL ROUTES`, err);
      }
    },
  );

router
  .route('/profilepic')
  .post(
    authController.protect,
    authMiddleware,
    upload.single('profilepic'),
    async (req, res) => {
      if (!req.file) {
        return res.status(400).send('No files uploaded');
      }

      try {
        const channelId = res.locals.user.channel; // Get channel ID from request
        console.log(`CHANNEL ID FROM VIDEO ROUTES:`, channelId);

        const imageResult = await uploadContentToS3(
          req.file,
          channelId,
          'image',
        );
        req.s3Data = {
          profilepic: imageResult || null,
        };

        // console.log(`REQUEST FROM /PROFILEPIC`, req);
        console.log(`s3Data FROM /PROFILEPIC`, req.s3Data);
        return channelController.uploadChannelPfp(req, res);

        // return console.log(`REQUEST ____ S3 DATA:`, req.s3Data);
        // return videoController.createVideo(req, res);
      } catch (err) {
        console.log(`ERROR FROM CHANNEL ROUTES`, err);
        res.status(500).send('File upload failed');
      }
    },
  );

router
  .route('/')
  .get(channelController.getAllChannels)
  .post(authController.protect, channelController.createChannel)
  .patch(
    authController.protect,
    channelController.uploadImages,
    channelController.updateChannel,
  );

router
  .route('/:id')
  .get(channelController.getChannel)
  .patch(
    authController.protect,
    channelController.uploadImages,
    channelController.updateChannel,
  )
  .delete(authController.protect, channelController.deleteChannel);

router.post(
  '/:id/subscribe',
  authController.protect,
  subscribeController.subscribe,
);

router.post(
  '/:id/unsubscribe',
  authController.protect,
  subscribeController.unsubscribe,
);
// router
//   .route('/:channelId/deactivate')
//   .delete(authController.protect, channelController.deactivateChannelAndVideos);

// router
//   .route('/deleteVideosWithChannel')
//   .delete(channelController.deleteChannelWithVideos);

module.exports = router;
