const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();
// router.get(
//   '/get-user-notification',
//   authController.protect,
//   viewsController.notifications,
// );

router.get('/tokens', viewsController.tokens);
router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/signup', viewsController.signup);
router.get('/login', authController.isLoggedIn, viewsController.login);
router.get(
  '/watch/:videoId',
  authController.isLoggedIn,
  viewsController.watchVideo,
);
router.get('/channels', authController.protect, viewsController.channelsList);
router.get('/search', viewsController.search);
router.get('/clipZ/watch/', viewsController.clipZ);
router.get('/user', authController.protect, viewsController.userProfile);
router.get('/upload', authController.protect, viewsController.upload);
router.get(
  '/user-channel',
  authController.protect,
  viewsController.userChannel,
);

router.get('/channels/:id', viewsController.singleChannel);

router.get(
  '/channel-settings',
  authController.protect,
  viewsController.channelSettings,
);
router.get('/all-uploads', authController.protect, viewsController.allVideos);
router.get(
  '/all-uploads/video',
  authController.protect,
  viewsController.singleVideo,
);

// router.get('/search', viewsController.search);

module.exports = router;
