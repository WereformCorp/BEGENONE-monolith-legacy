const path = require('path');
const express = require('express');
const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');
// const cookieParser = require('cookie-parser');
// const compression = require('compression');

// const AppError = require('./utils/appError');
// const channelRouter = require('./routes/channelRoutes');
// const discussionRouter = require('./routes/discussionRoutes');
// const sponsorRouter = require('./routes/sponsorRoutes');
// const storyRouter = require('./routes/storyRoutes');
// const viewsRouter = require('./routes/viewsRoutes');
// const productRouter = require('./routes/productRoutes');
// const reviewRouter = require('./routes/reviewRoutes');
// const userRouter = require('./routes/userRoutes');
const videoRouter = require('./routes/videoRoutes');

// Start Express App
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Test Middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTE
// app.use('/', viewsRouter);
// app.use('/api/v1/channel', channelRouter);
// app.use('/api/v1/discussion', discussionRouter);
// app.use('/api/v1/products', productRouter);
// app.use('/api/v1/reviews', reviewRouter);
// app.use('/api/v1/sponsors', sponsorRouter);
// app.use('/api/v1/story', storyRouter);
// app.use('/api/v1/user', userRouter);
app.use('/api/v1/video', videoRouter);

app.get('/overview', (req, res) => {
  res.status(200).render('main/contents/mainVideo', {
    title: 'Begenuine',
  });
});

// app.get('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

module.exports = app;
