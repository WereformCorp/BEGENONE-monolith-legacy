/**
 * @fileoverview Custom application error class for operational error handling
 * @module utils/appError
 * @layer Utility
 *
 * @description
 * Extends the native Error class with HTTP-specific metadata (statusCode, status)
 * and an isOperational flag. The isOperational flag distinguishes expected application
 * errors (e.g., 404, 401) from unexpected programming bugs, enabling the global error
 * handler to respond appropriately.
 *
 * @dependencies
 * - Upstream: Controllers, middleware, and route handlers throughout the application
 * - Downstream: None (leaf utility)
 */
class AppError extends Error {
  /**
   * @param {string} message - Human-readable error description sent in the response
   * @param {number} statusCode - HTTP status code (4xx for client errors, 5xx for server errors)
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.contructor);
  }
}

module.exports = AppError;
