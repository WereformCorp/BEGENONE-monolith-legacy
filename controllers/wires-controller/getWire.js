/**
 * @fileoverview Single wire retrieval by ID
 * @module controllers/wires-controller/getWire
 * @layer Controller
 *
 * @description
 * Fetches a single Wire document by its route parameter ID and returns it
 * in the JSON response. Returns a 404 error when the wire is not found.
 *
 * @dependencies
 * - Upstream: wire route handler
 * - Downstream: Wire model, AppError, catchAsync
 */
const Wire = require('../../models/wireModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const getWire = catchAsync(async (req, res, next) => {
  try {
    const data = await Wire.findById(req.params.id);
    if (!data)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));

    return res.status(200).json({
      status: 'Success',
      data,
    });
  } catch (err) {
    console.log(`GET WIRE | WIRES CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getWire;
