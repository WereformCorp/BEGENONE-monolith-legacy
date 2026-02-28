/**
 * @fileoverview Wire document creation with channel linkage
 * @module controllers/wires-controller/createWire
 * @layer Controller
 *
 * @description
 * Creates a new Wire document and pushes its ID into the authenticated user's
 * channel wires array. Returns the created wire data on success.
 *
 * @dependencies
 * - Upstream: wire route handler (authenticated)
 * - Downstream: Wire model, Channel model, AppError, catchAsync
 */
const Wire = require('../../models/wireModel');
const Channel = require('../../models/channelModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const createWire = catchAsync(async (req, res, next) => {
  try {
    const wireData = await Wire.create({
      heading: req.body.heading,
      subHeading: req.body.subHeading,
      bookmark: req.body.bookmark,
      wireText: req.body.wireText,
    });

    await Channel.findByIdAndUpdate(
      req.user.channel._id,
      { $push: { wires: [wireData._id] } },
      { new: true },
    );

    if (!wireData)
      await Channel.findByIdAndUpdate(req.user.channel._id, { wires: [] });

    if (!wireData) return next(new AppError(`Data Not Found!`, 404));

    res.status(201).json({
      status: 'success',
      data: wireData,
    });
  } catch (err) {
    console.log(`CREATE WIRES | WIRES CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = createWire;
