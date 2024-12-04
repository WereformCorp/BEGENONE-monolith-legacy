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
