// eslint-disable-next-line arrow-body-style
const catchAsync = (fn) => (req, res, next) => {
  return fn(req, res, next).catch(next);
};

module.exports = catchAsync;
