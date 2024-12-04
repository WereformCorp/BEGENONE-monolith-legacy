const Comment = require('../../models/commentModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

const updateComment = catchAsync(async (req, res, next) => {
  try {
    const data = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!data)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));

    return res.status(200).json({
      status: 'Success',
      data,
    });
  } catch (err) {
    console.log(`UDPATE COMMENT | COMMENTS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = updateComment;
