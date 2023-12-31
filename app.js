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

const AppError = require('./utils/appError');
const channelRouter = require('./routes/channelRoutes');
const commentRouter = require('./routes/commentRoutes');
const discussionRouter = require('./routes/discussionRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const sponsorRouter = require('./routes/sponsorRoutes');
const storyRouter = require('./routes/storyRoutes');
const userRouter = require('./routes/userRoutes');
const videoRouter = require('./routes/videoRoutes');
// const viewsRouter = require('./routes/viewsRoutes');

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

app.use(express.json()); // { limit: '10kb' }
app.use(express.urlencoded({ extended: true, limit: '10kb' })); //

// Test Middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTE
// app.use('/', viewsRouter);
app.use('/api/v1/channels', channelRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/discussions', discussionRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/sponsors', sponsorRouter);
app.use('/api/v1/stories', storyRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);

app.get('/overview', (req, res) => {
  res.status(200).render('main/contents/mainVideo', {
    title: 'Begenuine',
  });
});

app.get('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
