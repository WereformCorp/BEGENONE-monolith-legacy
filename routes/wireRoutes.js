const express = require('express');
const wireController = require('../controllers/wireController');
const authController = require('../controllers/authController');
// const commentRouter = require('./commentRoutes');
// const sponsorRouter = require('./sponsorRoutes');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(wireController.getAllWires)
  .post(authController.protect, wireController.createWire);

router
  .route('/:id')
  .get(wireController.getWire)
  .patch(authController.protect, wireController.updateWire)
  .delete(authController.protect, wireController.deleteWire);

module.exports = router;
