const pug = require('pug');
// eslint-disable-next-line import/order
const catchAsync = require('../utils/catchAsync');

const fs = require('fs');
const path = require('path');
// const AppError = require('../utils/appError.js');

exports.templify = catchAsync(async (req, res, next) => {
  // Read & compile the template
  const templatePath = path.join(
    __dirname,
    `../views/main/pug/${req.params.template}`,
  );

  req.body.loggedInUser = res.user;
  const compileFunction = pug.compileFile(templatePath);
  const compiledTemplate = compileFunction(req.body);

  // Send the template
  res.status(200).json({
    status: 'success',
    data: {
      compiledTemplate,
    },
  });
});
