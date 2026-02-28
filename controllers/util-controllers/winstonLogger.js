/**
 * @fileoverview Winston logging utility with console and file transports
 * @module controllers/util-controllers/winstonLogger
 * @layer Utility
 *
 * @description
 * Configures a Winston logger instance with info-level severity, outputting
 * to both the console and a persistent app.log file. Exports logInfo and
 * logError convenience wrappers for structured logging throughout the
 * application.
 *
 * @dependencies
 * - Upstream: Any module requiring structured logging
 * - Downstream: winston
 */
// eslint-disable-next-line import/no-extraneous-dependencies
const winston = require('winston');

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' }),
  ],
});

// Utility to log information, errors, etc.
const logInfo = (message, data) => {
  logger.info(message, data);
};

const logError = (message, data) => {
  logger.error(message, data);
};

module.exports = { logInfo, logError };
