/**
 * @fileoverview Channel listing endpoint
 * @module controllers/channel-controllers/getAllChannels
 * @layer Controller
 *
 * @description
 * Retrieves all Channel documents from the database and returns them
 * with a result count in the JSON response.
 *
 * @dependencies
 * - Upstream: channel route handler
 * - Downstream: Channel model, AppError, catchAsync
 */
const Channel = require('../../models/channelModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const getAllChannels = catchAsync(async (req, res, next) => {
  try {
    const data = await Channel.find();
    if (!data)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));
    return res.status(200).json({
      status: 'Success',
      results: data.length,
      data,
    });
  } catch (err) {
    console.log(`GET ALL CHANNEL | CHANNELS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getAllChannels;
