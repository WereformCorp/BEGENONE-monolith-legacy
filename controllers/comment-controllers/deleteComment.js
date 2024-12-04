const Comment = require('../../models/commentModel');
const catchAsync = require('../../utils/catchAsync');

const deleteComment = catchAsync(async (req, res, next) => {
  try {
    const data = await Comment.findByIdAndDelete(req.params.id);

    return res.status(204).json({
      status: 'success',
      data,
    });
  } catch (err) {
    console.log(`DELETE COMMENT | COMMENTS CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = deleteComment;
