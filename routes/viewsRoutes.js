const express = require('express');
// const viewsController = require('../controllers/viewsController');
const checkActiveStatus = require('../utils/checkActiveStatus');
// const authController = require('../controllers/authController');
const createPricingCheckout = require('../controllers/pricing-controllers/createPricingCheckout');
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
const userChannel = require('../controllers/view-controllers/userChannel');
const singleChannel = require('../controllers/view-controllers/singleChannel');
const channelSettings = require('../controllers/view-controllers/channelSettings');
const allVideos = require('../controllers/view-controllers/allVideos');
const singleVideo = require('../controllers/view-controllers/singleVideo');

const router = express.Router();
router.get(
  '/',
  createPricingCheckout,
  // authController.isLoggedIn,
  isLoggedIn,
  // viewsController.getOverview,
  getOverview,
);

router.get(
  '/pricings',
  isLoggedIn,
  // viewsController.pricings
  pricings,
);
router.get(
  '/api/v1/users/verifyEmail/:token',
  // viewsController.emailVerifyPage
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
  emailSentPage,
);
router.get(
  '/signup',
  // viewsController.signup
  signup,
);
router.get(
  '/login',
  // authController.isLoggedIn, viewsController.login
  isLoggedIn,
  login,
);
router.get(
  '/watch/:videoId',
  // authController.isLoggedIn,
  // viewsController.watchVideo,
  watchVideo,
);
router.get(
  '/channels',
  // authController.protect, viewsController.channelsList
  protect,
  channelsList,
);
router.get(
  '/search',
  // viewsController.search
  search,
);
router.get(
  '/clipZ/watch/',
  // viewsController.clipZ
  clipZ,
);
router.get(
  '/user',
  // authController.protect, viewsController.userProfile
  protect,
  userProfile,
);
router.get(
  '/upload',
  // authController.protect, viewsController.upload
  protect,
  upload,
);
router.get(
  '/user-channel',
  // authController.protect,
  protect,
  // viewsController.userChannel,
  userChannel,
);

router.get(
  '/channels/:id',
  // viewsController.singleChannel
  singleChannel,
);

router.get(
  '/channel-settings',
  checkActiveStatus,
  // authController.protect,
  protect,
  // viewsController.channelSettings,
  channelSettings,
);
router.get(
  '/all-uploads',
  // authController.protect, viewsController.allVideos
  protect,
  allVideos,
);
router.get(
  '/all-uploads/:videoId',
  // authController.protect,
  protect,
  // viewsController.singleVideo,
  singleVideo,
);

// router.get('/search', viewsController.search);

module.exports = router;
