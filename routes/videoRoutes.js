const express = require('express');
const videoController = require('../controllers/videoController');
const commentRouter = require('./commentRoutes');
const sponsorRouter = require('./sponsorRoutes');
const discussionRouter = require('./discussionRoutes');
// const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(videoController.getAllVideos)
  .post(videoController.createVideo);

router
  .route('/:id')
  .get(videoController.getVideo)
  .patch(videoController.updateVideo)
  .delete(videoController.deleteVideo);

router.use('/:videoId/comments', commentRouter);
router.use('/:videoId/sponsors', sponsorRouter);
router.use('/:videoId/discussions', discussionRouter);

module.exports = router;
