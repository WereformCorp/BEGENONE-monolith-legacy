/**
 * @fileoverview Self-service soft-delete controller
 * @module controllers/user-controllers/deleteMe
 * @layer Controller
 *
 * @description
 * Performs a soft delete on the authenticated user's account by setting the
 * active flag to false. The user document is retained in the database for
 * potential reactivation or auditing purposes.
 *
 * @dependencies
 * - Upstream: User route (DELETE /deleteMe), requires protect middleware
 * - Downstream: User model, catchAsync
 */
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');

const deleteMe = catchAsync(async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'Success',
      data: null,
    });
  } catch (err) {
    console.log(`DELETE ME | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = deleteMe;
