const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const db = require('./models');
const pidusage = require('pidusage');

const app = express();

pidusage(process.pid, { usePs: true });

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'NOT_FOUND'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

/**
 * ? Unnecessary sync for the moment
 * ! Sync force: true will override current table data and alter columns according to model setup
 * ! Try it if you want to boom your database.
 */
// db.sequelize
//   .sync({ force: true })
//   .then(() => {
//     infoLogger('All models were synchronized successfully');
//   })
//   .catch((error) => {
//     errorLogger("Can't syncronize", error);
//     console.log(error);
//   });

module.exports = app;
