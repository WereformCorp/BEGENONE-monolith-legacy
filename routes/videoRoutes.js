const express = require('express');

const videoController = require('../controllers/videoController');
const sponsorRouter = require('./sponsorRoutes');
const commentRouter = require('./commentRoutes');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(videoController.getAllVideos).post(
  authController.protect,
  // videoController.handleThumbnailUpload,
  videoController.handleVideoUpload,
  videoController.createVideo,
);

router
  .route('/:id')
  .get(videoController.getVideo)
  .patch(
    authController.protect,
    videoController.handleThumbnailUpload,
    videoController.updateVideo,
  )
  .delete(authController.protect, videoController.deleteVideo);

router.use('/:videoId/sponsors', sponsorRouter);
router.use('/:videoId/comments', commentRouter);

module.exports = router;
