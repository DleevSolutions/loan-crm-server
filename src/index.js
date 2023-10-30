const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { infoLogger } = require('./config/logger2');

let server;
// Launch App
server = app.listen(config.port, config.localIP, () => {
  infoLogger(`Localhost: ${config.port}`);
  infoLogger(`LAN: ${config.localIP}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
