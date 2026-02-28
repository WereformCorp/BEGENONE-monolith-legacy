/**
 * @fileoverview Wire (short-form text content) CRUD route definitions.
 * @module routes/wireRoutes
 * @layer Route
 * @basepath /api/v1/wires
 *
 * @description
 * Registers endpoints for listing, creating, retrieving, updating, and deleting
 * Wire documents. The router uses mergeParams: true for potential nested mounting.
 *
 * Middleware chain: protect guards create, update, and delete operations;
 * read operations are public.
 *
 * @dependencies
 * - Upstream: app.js (mounted at /api/v1/wires)
 * - Downstream: controllers/wires-controller/*, controllers/auth-controllers/protect
 */

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
