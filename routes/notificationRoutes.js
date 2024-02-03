const express = require('express');
const authController = require('../controllers/authController');
const notificationController = require('../controllers/notificationController');

const router = express.Router({ mergeParams: true });

router.get(
  '/get-all-notification',
  authController.protect,
  notificationController.getNotifications,
);

router
  .route('/get-notification')
  .get(authController.protect, notificationController.getUserNotifications);
router
  .route('/read-notification')
  .post(authController.protect, notificationController.markNotificationsAsRead);

module.exports = router;
