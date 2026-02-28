/**
 * @fileoverview Wire listing endpoint
 * @module controllers/wires-controller/getAllWires
 * @layer Controller
 *
 * @description
 * Retrieves all Wire documents from the database and returns them
 * with a result count in the JSON response.
 *
 * @dependencies
 * - Upstream: wire route handler
 * - Downstream: Wire model, AppError, catchAsync
 */
const Wire = require('../../models/wireModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const getAllWires = catchAsync(async (req, res, next) => {
  try {
    const data = await Wire.find({});
    if (!data)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));
    return res.status(200).json({
      status: 'Success',
      results: data.length,
      data,
    });
  } catch (err) {
    console.log(`GET ALL WIRES | WIRES CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getAllWires;
