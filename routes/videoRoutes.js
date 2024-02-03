const express = require('express');

const videoController = require('../controllers/videoController');
const {
  uploadVidFile,
  uploadThumbnail,
} = require('../controllers/videoController');
const sponsorRouter = require('./sponsorRoutes');
const commentRouter = require('./commentRoutes');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(videoController.getAllVideos).post(
  authController.protect,
  uploadVidFile,
  // uploadThumbnail,
  videoController.createVideo,
);

router
  .route('/interaction/:videoId/:action')
  .patch(authController.protect, videoController.updateLikesDislikes);

router
  .route('/:id')
  .get(videoController.getVideo)
  .patch(authController.protect, uploadThumbnail)
  .delete(authController.protect, videoController.deleteVideo);

router.use('/:videoId/sponsors', sponsorRouter);
router.use('/:videoId/comments', commentRouter);

module.exports = router;
