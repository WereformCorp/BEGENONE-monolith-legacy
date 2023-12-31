const express = require('express');
const channelController = require('../controllers/channelController');
// const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(channelController.getAllChannels)
  .post(channelController.createChannel);

router
  .route('/:id')
  .get(channelController.getChannel)
  .patch(channelController.updateChannel)
  .delete(channelController.deleteChannel);

module.exports = router;
