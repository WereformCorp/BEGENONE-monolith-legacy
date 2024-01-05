const express = require('express');
const videoController = require('../controllers/videoController');
const sponsorRouter = require('./sponsorRoutes');
const commentRouter = require('./commentRoutes');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, videoController.getAllVideos)
  // .post(videoController.createVideo) // CREATE VIDEO WITHOUT REFERRING TO THE CHANNEL !!! DONOT NOT USE
  .post(videoController.setChannelIds, videoController.createVideo);

router
  .route('/:id')
  .get(videoController.getVideo)
  .patch(videoController.updateVideo)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    videoController.deleteVideo,
  );

// router.use('/:videoId/comments', commentRouter); // WILL USE IT LATER
router.use('/:videoId/sponsors', sponsorRouter);
router.use('/:videoId/comments', commentRouter);
// router.use('/:videoId/wires', wireRouter); // WIRES DON'T HAPPEN ON VIDEOS RATHER ON CHANNEL

module.exports = router;
