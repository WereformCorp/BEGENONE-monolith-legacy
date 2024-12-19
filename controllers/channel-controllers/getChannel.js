const Channel = require('../../models/channelModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const getChannel = catchAsync(async (req, res, next) => {
  try {
    console.log(`❌❌❌ REQUESTED ID FROM PARAMS:`, req.params.id);
    const data = await Channel.findById(req.params.id);

    console.log(`DATA FROM GET CHANNEL:`, data);

    console.log(`⭕⭕⭕ GET CHANNEL FUNCTION`, data);
    if (!data)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));

    return res.status(200).json({
      status: 'Success',
      data,
    });
  } catch (err) {
    console.log(`GET CHANNEL | CHANNELS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getChannel;
