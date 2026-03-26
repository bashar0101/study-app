const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const ApiError = require('./utils/apiError');
const { connectRedis } = require('./config/redis');

const app = express();

// Security HTTP headers
app.use(helmet());

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: config.env === 'production' ? config.frontendUrl : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

// Default morgan logger
if (config.env !== 'test') {
  app.use(morgan('dev'));
}

const routes = require('./routes/v1');

// v1 api routes
app.use('/api', routes);

// test route
app.get('/health', (req, res) => res.send('OK'));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(404, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorHandler);

const server = app.listen(config.port, async () => {
  console.log(`Listening to port ${config.port}`);
  await connectRedis();
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});
