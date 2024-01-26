const express = require('express');
const channelController = require('../controllers/channelController');
const subscribeController = require('../controllers/subscribeController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

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
// router
//   .route('/:channelId/deactivate')
//   .delete(authController.protect, channelController.deactivateChannelAndVideos);

// router
//   .route('/deleteVideosWithChannel')
//   .delete(channelController.deleteChannelWithVideos);

module.exports = router;
