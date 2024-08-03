const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');

// const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const authController = require('./controllers/authController');

const AppError = require('./utils/appError');
const channelRouter = require('./routes/channelRoutes');
const notificationRouter = require('./routes/notificationRoutes');
const urlPathRoutes = require('./routes/urlPathRoutes');

// Start Express App
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// USING CORS
app.use(cors());

// SET SECURITY HTTP HEADERS
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// LIMIT REQUEST FROM SAME API
// const limiter = rateLimit({
//   max: 1000,
//   windowMs: 60 * 60 * 100000,
//   message: 'Too many requests from this IP, Please try again in an hour!',
// });

// app.use('/api', limiter);

app.use(express.json()); //{ limit: '10kb' }
app.use(express.urlencoded({ extended: true })); // limit: '10kb'
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// app.use(hpp());

app.use(compression());

// Test Middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(authController.isLoggedIn);

const attachUserToLocals = (req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
};

// Apply the middleware to all routes
app.use(attachUserToLocals);

// 3) ROUTE
app.use('/', viewsRouter);
app.use('/api/v1/channels', channelRouter);

// eslint-disable-next-line arrow-body-style
app.get('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404),
  );
});

module.exports = app;
