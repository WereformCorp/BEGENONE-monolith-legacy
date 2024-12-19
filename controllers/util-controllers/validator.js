// eslint-disable-next-line import/no-extraneous-dependencies
const { body, validationResult } = require('express-validator');

// Middleware to validate inputs
// eslint-disable-next-line arrow-body-style
const validatePricingID = () => {
  return [body('pricingID').isMongoId().withMessage('Invalid pricing ID')];
};

// Middleware to check for validation errors
const checkValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validatePricingID, checkValidationErrors };
