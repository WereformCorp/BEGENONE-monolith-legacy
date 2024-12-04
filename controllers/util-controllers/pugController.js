const pug = require('pug');
// eslint-disable-next-line import/order
const catchAsync = require('../../utils/catchAsync');
// eslint-disable-next-line import/order
const path = require('path');

const templify = catchAsync(async (req, res, next) => {
  try {
    // Read & compile the template
    const templatePath = path.join(
      __dirname,
      `../../views/main/${req.params.template}`,
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
  } catch (err) {
    console.log(`TEMPLIFY | PUG CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = templify;
