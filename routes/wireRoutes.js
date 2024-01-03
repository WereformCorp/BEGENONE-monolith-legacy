const express = require('express');
const wireController = require('../controllers/wireController');
// const commentRouter = require('./commentRoutes');
// const sponsorRouter = require('./sponsorRoutes');
// const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(wireController.getAllWires)
  // .post(stringController.createString) // CREATE VIDEO WITHOUT REFERRING TO THE CHANNEL !!! DONOT NOT USE
  .post(wireController.setChannelIds, wireController.createWire);

router
  .route('/:id')
  .get(wireController.getWire)
  .patch(wireController.updateWire)
  .delete(wireController.deleteWire);

// router.use('/:wireId/comments', commentRouter);
// router.use('/:wireId/wire/sponsors', sponsorRouter);

module.exports = router;
