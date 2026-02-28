/**
 * @fileoverview Basic string input sanitization utility
 * @module controllers/util-controllers/inputValidation
 * @layer Utility
 *
 * @description
 * Provides a validateInput function that ensures a given value is a
 * non-empty string. Throws an Error for any input that fails the type
 * check or is blank after trimming.
 *
 * @dependencies
 * - Upstream: Any controller or service requiring pre-validated string input
 * - Downstream: None
 */
// Ensure that a given input is valid before proceeding
const validateInput = (input) => {
  if (typeof input !== 'string' || input.trim().length === 0) {
    throw new Error('Invalid input');
  }
  return input;
};

module.exports = { validateInput };
