// const Notification = require('../models/notificationModel');
// const catchAsync = require('../utils/catchAsync');

// exports.getNotifications = catchAsync(async (req, res) => {
//   const notifications = await Notification.find();

//   console.log(`GET NOTIFICATIONS CONTROLLER: ${notifications}`);

//   if (notifications.length > 0) {
//     res.status(200).json({
//       status: 'success',
//       data: notifications,
//     });
//   } else {
//     res.status(204).json({
//       status: 'success',
//       message: 'No unread notifications',
//     });
//   }
// });

// exports.getUserNotifications = catchAsync(async (req, res, next) => {
//   try {
//     const userId = req.user._id;
//     // Retrieve unread notifications for the user
//     const notifications = await Notification.find({
//       userId,
//       readStatus: false,
//     });

//     // console.log(`Notification from Notification Controller: '${notifications}'`);

//     if (notifications)
//       return res.status(200).json({
//         status: 'success',
//         data: notifications,
//       });
//   } catch (err) {
//     res.json({
//       status: 'fail',
//       message: err.message,
//       err,
//     });
//   }
// });

// exports.markNotificationsAsRead = catchAsync(async (req, res) => {
//   const userId = req.user._id;

//   // Mark all notifications for the user as read
//   await Notification.updateMany({ userId }, { $set: { readStatus: true } });

//   res.status(200).json({
//     status: 'success',
//     message: 'Notifications marked as read',
//   });
// });
