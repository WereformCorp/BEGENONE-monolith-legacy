const express = require('express');
// const viewsController = require('../controllers/viewsController');
const checkActiveStatus = require('../utils/checkActiveStatus');
// const authController = require('../controllers/authController');
// const createPricingCheckout = require('../controllers/pricing-controllers/createPricingCheckout');
const isLoggedIn = require('../controllers/auth-controllers/isLoggedIn');
const getOverview = require('../controllers/view-controllers/getOverview');
const pricings = require('../controllers/view-controllers/pricings');
const emailVerifyPage = require('../controllers/view-controllers/emailVerify');
const reVerifyEmail = require('../controllers/view-controllers/reVerifyEmail');
const emailSentPage = require('../controllers/view-controllers/emailSentPage');
const signup = require('../controllers/view-controllers/signup');
const login = require('../controllers/view-controllers/login');
const watchVideo = require('../controllers/view-controllers/watchVideo');
const protect = require('../controllers/auth-controllers/protect');
const channelsList = require('../controllers/view-controllers/channelList');
const search = require('../controllers/view-controllers/search');
const clipZ = require('../controllers/view-controllers/clipZ');
const userProfile = require('../controllers/view-controllers/userProfile');
const upload = require('../controllers/view-controllers/upload');
// const userChannel = require('../controllers/view-controllers/userChannel');
const singleChannel = require('../controllers/view-controllers/singleChannel');
const channelSettings = require('../controllers/view-controllers/channelSettings');
const allVideos = require('../controllers/view-controllers/allVideos');
const singleVideo = require('../controllers/view-controllers/singleVideo');
const {
  // checkSubscription,
  checkUserSubscription,
} = require('../controllers/util-controllers/checkSubscription');

const router = express.Router();
router.get(
  '/',
  // createPricingCheckout,
  // authController.isLoggedIn,
  isLoggedIn,
  checkUserSubscription,
  // viewsController.getOverview,
  getOverview,
);

router.get(
  '/pricings',
  isLoggedIn,
  checkUserSubscription,
  // viewsController.pricings
  pricings,
);
router.get(
  '/api/v1/users/verifyEmail/:token',
  // viewsController.emailVerifyPage
  checkUserSubscription,
  emailVerifyPage,
);
router.get(
  '/re-verify/',
  // viewsController.reVerifyEmail
  reVerifyEmail,
);
router.get(
  '/email-confirmation',
  // viewsController.emailSentPage
  checkUserSubscription,
  emailSentPage,
);
router.get(
  '/signup',
  // viewsController.signup
  checkUserSubscription,
  signup,
);
router.get(
  '/login',
  // authController.isLoggedIn, viewsController.login
  isLoggedIn,
  checkUserSubscription,
  login,
);
router.get(
  '/watch/:videoId',
  isLoggedIn,
  checkUserSubscription,
  // authController.isLoggedIn,
  // viewsController.watchVideo,
  watchVideo,
);
router.get(
  '/channels',
  // authController.protect, viewsController.channelsList
  protect,
  checkUserSubscription,
  channelsList,
);
router.get(
  '/search',
  // viewsController.search
  checkUserSubscription,
  search,
);
router.get(
  '/clipZ/watch/',
  // viewsController.clipZ
  checkUserSubscription,
  clipZ,
);
router.get(
  '/user',
  // authController.protect, viewsController.userProfile
  protect,
  checkUserSubscription,
  userProfile,
);
router.get(
  '/upload',
  // authController.protect, viewsController.upload
  protect,
  // checkSubscription,
  checkUserSubscription,
  upload,
);
// router.get(
//   '/user-channel',
//   // authController.protect,
//   protect,
//   // viewsController.userChannel,
//   userChannel,
// );

router.get(
  '/channels/:id',
  isLoggedIn,
  checkUserSubscription,
  // viewsController.singleChannel
  singleChannel,
);

router.get(
  '/channel-settings',
  checkActiveStatus,
  // authController.protect,
  protect,
  checkUserSubscription,
  // viewsController.channelSettings,
  channelSettings,
);
router.get(
  '/all-uploads',
  // authController.protect, viewsController.allVideos
  protect,
  checkUserSubscription,
  allVideos,
);
router.get(
  '/all-uploads/:videoId',
  // authController.protect,
  // viewsController.singleVideo,
  protect,
  checkUserSubscription,
  singleVideo,
);

// router.get('/search', viewsController.search);

module.exports = router;
