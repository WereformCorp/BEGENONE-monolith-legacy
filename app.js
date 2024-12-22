const path = require('path');
const express = require('express');
const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');

// const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

// const protect = require('./controllers/auth-controllers/protect');

// const authController = require('./controllers/authController');
// const Pricing = require('./models/pricingModel');
// const User = require('./models/userModel');
// const Channel = require('./models/channelModel');
// const Wires = require('./models/wireModel');
// const Video = require('./models/videoModel');
// const Subscription = require('./models/subscriptionModel');
// const isLoggedIn = require('./controllers/auth-controllers/isLoggedIn');

const AppError = require('./utils/appError');
const channelRouter = require('./routes/channelRoutes');
const commentRouter = require('./routes/commentRoutes');
const wireRouter = require('./routes/wireRoutes');
// const productRouter = require('./routes/productRoutes');
// const reviewRouter = require('./routes/reviewRoutes');
// const sponsorRouter = require('./routes/sponsorRoutes');
// const storyRouter = require('./routes/storyRoutes');
const userRouter = require('./routes/userRoutes');
const videoRouter = require('./routes/videoRoutes');
const viewsRouter = require('./routes/viewsRoutes');
const searchRouter = require('./routes/searchRoutes');
const pricingRouter = require('./routes/pricingRoutes');
const webhookCheckout = require('./controllers/pricing-controllers/webhookCheckout');
// const notificationRouter = require('./routes/notificationRoutes');
const urlPathRoutes = require('./routes/urlPathRoutes');

// const verifyStripeWebhook = require('./controllers/util-controllers/verifyStripeWebhook');
// const calculateTotalPrice = require('./controllers/util-controllers/price');
// const updateSubscriptionStatus = require('./utils/subscription');

// const {
//   // checkSubscription,
//   checkUserSubscription,
// } = require('./controllers/util-controllers/checkSubscription');

// Start Express App
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// USING CORS
app.use(cors());

// SET SECURITY HTTP HEADERS
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: false,
    originAgentCluster: false,
  }),
);

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Node Version:', process.version);

// LIMIT REQUEST FROM SAME API
// const limiter = rateLimit({
//   max: 1000,
//   windowMs: 60 * 60 * 100000,
//   message: 'Too many requests from this IP, Please try again in an hour!',
// });

// app.use('/api', limiter);

app.post(
  '/webhooks-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout,
);

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
  // console.log(req.headers);
  next();
});

// app.use(authController.isLoggedIn);

// Middleware to redirect to the main page if the user is already logged in
// const redirectIfLoggedIn = function (req, res, next) {
//   // if (req.user) {
//   //   res.locals.user = req.user;
//   // }

//   if (req.user) {
//     // If the user is logged in, redirect to the main page
//     return res.redirect('/');
//   }

//   // If the user is not logged in, proceed to the next middleware/route handler
//   next();
// };

// // Apply redirectIfLoggedIn middleware for the '/login' and '/signup' routes
// app.use(['/login', '/signup'], redirectIfLoggedIn);

// const updateMany = async (model) => {
//   try {
//     // const subscription = await User.findOne({
//     //   pricingName: 'signup',
//     // });
//     // Here we perform an "update" without any set field operation

//     // console.log(`SUBSCRIPTION DOCUMENT FROM APP.JS`, subscription);
//     const result = await model.updateMany({});
//     console.log(
//       `Matched ${result.matchedCount} documents and modified ${result.modifiedCount} documents.`,
//     );
//     return result;
//   } catch (err) {
//     console.error('Error updating documents:', err);
//     throw err;
//   }
// };

// Example usage for the 'Pricing' model
// FIXME: RISKY MOVE DO NOT DO IT.
/////////////////////////////////// updateMany(User); ///////////////////////////////////
// FIXME: RISKY MOVE DO NOT DO IT.

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
app.use('/url', urlPathRoutes);
app.use('/search', searchRouter);
// app.use('/api/v1/notification', notificationRouter);
app.use('/api/v1/channels', channelRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/wires', wireRouter);
// app.use('/api/v1/products', productRouter);
// app.use('/api/v1/reviews', reviewRouter);
// app.use('/api/v1/sponsors', sponsorRouter);
// app.use('/api/v1/stories', storyRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/pricings', pricingRouter);

app.use((req, res, next) =>
  res.status(404).send(`Sorry, Page Not Found. Error ${res.statusCode}`),
);

// eslint-disable-next-line arrow-body-style
app.get('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404),
  );
});

module.exports = app;
