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
