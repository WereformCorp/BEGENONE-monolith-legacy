/**
 * @fileoverview Channel CRUD, subscription, and image upload route definitions.
 * @module routes/channelRoutes
 * @layer Route
 * @basepath /api/v1/channels
 *
 * @description
 * Registers endpoints for channel listing, creation, retrieval, deletion,
 * subscribe/unsubscribe actions, and image uploads (banner, profile picture).
 * Multer is configured with memoryStorage for in-memory buffering before
 * S3 upload of channel branding assets.
 *
 * Middleware chain: protect and authMiddleware guard mutating and upload
 * operations; public GET routes are unauthenticated.
 *
 * @dependencies
 * - Upstream: app.js (mounted at /api/v1/channels)
 * - Downstream: controllers/channel-controllers/*, controllers/auth-controllers/protect, controllers/util-controllers/authMiddleware, multer
 */

// MULTER & EXPRESS
const express = require('express');
const multer = require('multer');

// UPLOADS | PFP | BANNER
const uploadBanner = require('../controllers/channel-controllers/s3UploadBanner');
const uploadPfp = require('../controllers/channel-controllers/s3UploadPfp');

// CHANNEL CONTROLLERS
const getAllChannels = require('../controllers/channel-controllers/getAllChannels');
const protect = require('../controllers/auth-controllers/protect');
const createChannel = require('../controllers/channel-controllers/createChannel');
const getChannel = require('../controllers/channel-controllers/getChannel');
const deleteChannel = require('../controllers/channel-controllers/deleteChannel');
const subscribe = require('../controllers/channel-controllers/subscribe');
const unsubscribe = require('../controllers/channel-controllers/unsubscribe');
const authMiddleware = require('../controllers/util-controllers/authMiddleware');

// ---------------- ROUTING START HERE ---------------- //
const router = express.Router({ mergeParams: true });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload Channel Banner
router
  .route('/banner')
  .post(protect, authMiddleware, upload.single('banner'), uploadBanner);

// Upload Channel Picture
router
  .route('/profilepic')
  .post(protect, authMiddleware, upload.single('profilepic'), uploadPfp);

// Get All Channels OR/AND Create Channel
router.route('/').get(getAllChannels).post(protect, createChannel);

// Get Single Channel OR/AND Delete Channel
router.route('/:id').get(getChannel).delete(protect, deleteChannel);

// Subscribe Channel
router.post('/:id/subscribe', protect, subscribe);

// Unsubscribe Channel
router.post('/:id/unsubscribe', protect, unsubscribe);

module.exports = router;

/////////////////////////////////////// ________________________________________
// .post(authController.protect, channelController.createChannel)

// CONTROLLERS
// const channelController = require('../controllers/channelController');
// const subscribeController = require('../controllers/subscribeController');
// const authController = require('../controllers/authController');

// async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No files uploaded');
//   }

//   try {
//     const channelId = res.locals.user.channel; // Get channel ID from request
//     console.log(`CHANNEL ID FROM VIDEO ROUTES:`, channelId);

//     const imageResult = await uploadContentToS3(
//       req.file,
//       channelId,
//       'image',
//     );
//     req.s3Data = {
//       profilepic: imageResult || null,
//     };

//     // console.log(`REQUEST FROM /PROFILEPIC`, req);
//     console.log(`s3Data FROM /PROFILEPIC`, req.s3Data);
//     return channelController.uploadChannelPfp(req, res);

//     // return console.log(`REQUEST ____ S3 DATA:`, req.s3Data);
//     // return videoController.createVideo(req, res);
//   } catch (err) {
//     console.log(`ERROR FROM CHANNEL ROUTES`, err);
//     res.status(500).send('File upload failed');
//   }
// },

// router
//   .route('/:channelId/deactivate')
//   .delete(authController.protect, channelController.deactivateChannelAndVideos);

// router
//   .route('/deleteVideosWithChannel')
//   .delete(channelController.deleteChannelWithVideos);

// /////////////////////////////////

// async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No files uploaded');
//   }

//   try {
//     const channelId = res.locals.user.channel; // Get channel ID from request
//     console.log(`CHANNEL ID FROM VIDEO ROUTES:`, channelId);

//     const imageResult = await uploadContentToS3(
//       req.file,
//       channelId,
//       'image',
//     );
//     req.s3Data = {
//       banner: imageResult || null,
//     };

//     console.log(`s3Data FROM /PROFILEPIC`, req.s3Data);
//     return channelController.uploadChannelBanner(req, res);

//     // return videoController.createVideo(req, res);
//   } catch (err) {
//     console.log(`ERROR FROM CHANNEL ROUTES`, err);
//   }
// },
