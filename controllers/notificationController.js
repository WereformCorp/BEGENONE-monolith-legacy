const Notification = require('../models/notificationModel');
const catchAsync = require('../utils/catchAsync');

exports.getNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.find();
  res.status(200).json({
    status: 'success',
    data: notifications,
  });
});

exports.getUserNotifications = catchAsync(async (req, res) => {
  const userId = req.user._id;

  // Retrieve unread notifications for the user
  const notifications = await Notification.find({ userId, readStatus: false });

  res.status(200).json({
    status: 'success',
    data: notifications,
  });
});

exports.markNotificationsAsRead = catchAsync(async (req, res) => {
  const userId = req.user._id;

  // Mark all notifications for the user as read
  await Notification.updateMany({ userId }, { $set: { readStatus: true } });

  res.status(200).json({
    status: 'success',
    message: 'Notifications marked as read',
  });
});
