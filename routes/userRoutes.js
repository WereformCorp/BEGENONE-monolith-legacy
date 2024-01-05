const express = require('express');
const userController = require('../controllers/userController');
const channelRouter = require('./channelRoutes');
const authController = require('../controllers/authController');
// const viewsController = require('../controllers/viewsController');

const router = express.Router({ mergeParams: true });

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// router.use('/tokens', viewsController.getTokens); // HAVEN'T SET THE "GET TOKENS FUNCTION YET!"
// router.use('/channel', channelRouter);

router.use('/:userId/channel', channelRouter);

module.exports = router;
