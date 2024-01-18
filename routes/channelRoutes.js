const express = require('express');
const channelController = require('../controllers/channelController');
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
  // .patch(
  //   authController.protect,
  //   channelController.uploadUserPhoto,
  //   channelController.updateChannel,
  // )
  .delete(authController.protect, channelController.deleteChannel);

// router
//   .route('/:channelId/deactivate')
//   .delete(authController.protect, channelController.deactivateChannelAndVideos);

// router
//   .route('/deleteVideosWithChannel')
//   .delete(channelController.deleteChannelWithVideos);

module.exports = router;
