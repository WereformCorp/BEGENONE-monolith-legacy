/**
 * @fileoverview Channel document deletion by ID
 * @module controllers/channel-controllers/deleteChannel
 * @layer Controller
 *
 * @description
 * Deletes a single Channel document identified by its route parameter ID.
 * Returns HTTP 204 on success.
 *
 * @dependencies
 * - Upstream: channel route handler
 * - Downstream: Channel model, catchAsync
 */
const Channel = require('../../models/channelModel');
const catchAsync = require('../../utils/catchAsync');

const deleteChannel = catchAsync(async (req, res, next) => {
  try {
    const data = await Channel.findByIdAndDelete(req.params.id);
    return res.status(204).json({
      status: 'success',
      data,
    });
  } catch (err) {
    console.log(`DELETE CHANNEL | CHANNELS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = deleteChannel;
