const express = require('express');
const videoController = require('../controllers/videoController');
// const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(videoController.getAllVideos);
router.route('/:id').patch(videoController.updateVideo);

module.exports = router;
