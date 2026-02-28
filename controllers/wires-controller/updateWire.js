/**
 * @fileoverview Wire document update by ID
 * @module controllers/wires-controller/updateWire
 * @layer Controller
 *
 * @description
 * Updates an existing Wire document identified by its route parameter ID.
 * Merges request body fields into the document and returns the updated version.
 *
 * @dependencies
 * - Upstream: wire route handler
 * - Downstream: Wire model, AppError, catchAsync
 */
const Wire = require('../../models/wireModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const updateWire = catchAsync(async (req, res, next) => {
  try {
    const data = await Wire.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!data)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));

    return res.status(200).json({
      status: 'Success',
      data,
    });
  } catch (err) {
    console.log(`UPDATE WIRES | WIRES CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = updateWire;
