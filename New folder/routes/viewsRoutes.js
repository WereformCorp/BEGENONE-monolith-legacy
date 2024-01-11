const express = require('express');
const viewsController = require('../controllers/viewsController');
// const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(viewsController.getOverview);
router.route('/watch/:videoId').get(viewsController.watchVideo);
router.route('/channels').get(viewsController.channelsList);
router.route('/search').get(viewsController.search);

module.exports = router;
