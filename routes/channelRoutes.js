const express = require('express');
const channelController = require('../controllers/channelController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(channelController.getAllChannels)
  .post(authController.protect, channelController.createChannel);

router
  .route('/:id')
  .get(channelController.getChannel)
  .patch(
    authController.protect,
    // channelController.uploadUserPhoto,
    channelController.updateChannel,
  )
  .delete(authController.protect, channelController.deleteChannel);

module.exports = router;
