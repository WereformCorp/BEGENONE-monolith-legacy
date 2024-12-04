const Comment = require('../../models/commentModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const getComment = catchAsync(async (req, res, next) => {
  try {
    const data = await Comment.findById(req.params.id);
    if (!data)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));

    return res.status(200).json({
      status: 'Success',
      data,
    });
  } catch (err) {
    console.log(`GET COMMENT | COMMENTS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getComment;
