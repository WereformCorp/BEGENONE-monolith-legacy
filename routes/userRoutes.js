const express = require('express');
const userController = require('../controllers/userController');
// const viewsController = require('../controllers/viewsController');
// const channelRouter = require('./channelRoutes');
// const authController = require('../controllers/authController');

const router = express.Router();

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

module.exports = router;
