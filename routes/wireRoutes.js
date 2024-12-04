const express = require('express');
// const wireController = require('../controllers/wireController');
// const authController = require('../controllers/authController');
const getAllWires = require('../controllers/wires-controller/getAllWires');
const createWire = require('../controllers/wires-controller/createWire');
const protect = require('../controllers/auth-controllers/protect');
const getWire = require('../controllers/wires-controller/getWire');
const updateWire = require('../controllers/wires-controller/updateWire');
const deleteWire = require('../controllers/wires-controller/deleteWire');
// const commentRouter = require('./commentRoutes');
// const sponsorRouter = require('./sponsorRoutes');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    // wireController.getAllWires
    getAllWires,
  )
  .post(
    // authController.protect, wireController.createWire
    protect,
    createWire,
  );

router
  .route('/:id')
  .get(
    // wireController.getWire,
    getWire,
  )
  .patch(
    // authController.protect,
    protect,
    updateWire,
  )
  .delete(
    // authController.protect, wireController.deleteWire
    protect,
    deleteWire,
  );

module.exports = router;
