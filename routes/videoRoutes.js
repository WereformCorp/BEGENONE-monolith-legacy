const express = require('express');

const videoController = require('../controllers/videoController');
const sponsorRouter = require('./sponsorRoutes');
const commentRouter = require('./commentRoutes');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.post(
  '/thumbnail',
  authController.protect,
  videoController.uploadThumbnail,
  videoController.finalizeThumb,
);

router
  .route('/')
  .get(videoController.getAllVideos)
  .post(
    authController.protect,
    videoController.uploadVidFile,
    videoController.createVideo,
  );

router
  .route('/interaction/:videoId/:action')
  .patch(authController.protect, videoController.updateLikesDislikes);

router
  .route('/:id')
  .get(videoController.getVideo)
  .patch(authController.protect, videoController.updateVideo)
  .delete(authController.protect, videoController.deleteVideo);

router.use('/:videoId/sponsors', sponsorRouter);
router.use('/:videoId/comments', commentRouter);

module.exports = router;
