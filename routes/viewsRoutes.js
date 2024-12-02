const express = require('express');
const viewsController = require('../controllers/viewsController');
const checkActiveStatus = require('../utils/checkActiveStatus');
const authController = require('../controllers/authController');
const pricingController = require('../controllers/pricingController');

const router = express.Router();
// router.get(
//   '/get-user-notification',
//   authController.protect,
//   viewsController.notifications,
// );
router.get(
  '/',
  pricingController.createPricingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview,
);

router.get('/pricings', viewsController.pricings);
router.get('/api/v1/users/verifyEmail/:token', viewsController.emailVerifyPage);
router.get('/re-verify/', viewsController.reVerifyEmail);
router.get('/email-confirmation', viewsController.emailSentPage);
router.get('/signup', viewsController.signup);
router.get('/login', authController.isLoggedIn, viewsController.login);
router.get(
  '/watch/:videoId',
  // authController.isLoggedIn,
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
  checkActiveStatus,
  authController.protect,
  viewsController.channelSettings,
);
router.get('/all-uploads', authController.protect, viewsController.allVideos);
router.get(
  '/all-uploads/:videoId',
  authController.protect,
  viewsController.singleVideo,
);

// router.get('/search', viewsController.search);

module.exports = router;
