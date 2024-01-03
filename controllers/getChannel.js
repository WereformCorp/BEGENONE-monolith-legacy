const Channel = require('../models/channelModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getChannel = catchAsync(async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);

    // .populate({
    //   path: 'videos',
    //   select: '_id',
    // });
    if (!channel) return next(new AppError(`Channels Not Found!`, 404));

    if (channel)
      return res.status(200).json({
        status: 'Success',
        data: channel,
      });
  } catch (err) {
    console.error(err);
  }
});
