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
