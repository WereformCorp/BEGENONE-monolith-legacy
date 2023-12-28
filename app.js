const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const channelRoutes = require('./routes/channelRoutes');
const cdmRoutes = require('./routes/cdmRoutes');
const lvmRoutes = require('./routes/lvmRoutes');
const svmRoutes = require('./routes/svmRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');
const storyRoutes = require('./routes/storyRoutes');
const viewsRoutes = require('./routes/viewsRoutes');
const marketRoutes = require('./routes/marketRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');

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

// 3) ROUTE
app.use('/', viewsRotuer);

module.exports = app;
