/**
 * @fileoverview Express-validator middleware for pricing ID validation
 * @module controllers/util-controllers/validator
 * @layer Middleware
 *
 * @description
 * Exports two middleware functions: validatePricingID returns an array of
 * express-validator checks ensuring req.body.pricingID is a valid MongoDB
 * ObjectId. checkValidationErrors inspects the validation result and returns
 * 400 with error details if any checks failed, otherwise passes control
 * to the next handler.
 *
 * @dependencies
 * - Upstream: Routes accepting a pricingID in the request body
 * - Downstream: express-validator (body, validationResult)
 */
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
