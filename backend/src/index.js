const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
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

// Parse cookies
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: config.env === 'production' ? config.frontendUrl : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

// Request logging
if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// API routes
const routes = require('./routes/v1');
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => res.send('OK'));

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(404, 'Not found'));
});

// Global error handler
app.use(errorHandler);

const server = app.listen(config.port, async () => {
  console.log(`Server listening on port ${config.port}`);
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
  if (server) server.close();
});
