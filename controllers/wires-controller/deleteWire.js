/**
 * @fileoverview Wire document deletion by ID
 * @module controllers/wires-controller/deleteWire
 * @layer Controller
 *
 * @description
 * Deletes a single Wire document identified by its route parameter ID.
 * Returns HTTP 204 on success.
 *
 * @dependencies
 * - Upstream: wire route handler
 * - Downstream: Wire model, catchAsync
 */
const Wire = require('../../models/wireModel');
const catchAsync = require('../../utils/catchAsync');

const deleteWire = catchAsync(async (req, res, next) => {
  try {
    const data = await Wire.findByIdAndDelete(req.params.id);

    return res.status(204).json({
      status: 'success',
      data,
    });
  } catch (err) {
    console.log(`DELETE WIRES | WIRES CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = deleteWire;
