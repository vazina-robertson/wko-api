const http = require('http');

const listen = (app, customPort, logger) => {

  function normalizePort(val)
  {
    const port = parseInt(val, 10);
    return isNaN(port) ? val : (port >= 0 ? port : false);
  }

  // event handlers reference this below
  const port = normalizePort(customPort);

  function onError(error)
  {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
      case 'EACCES':
        logger.kv('err', error).error(`Error: ${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.kv('err', error).error(`Error: ${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  function onListening()
  {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    logger.log('Listening on ' + bind);
  }

  // set port
  app.set('port', port);

  // listen on provided port
  const server = http.createServer(app);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);


};

module.exports = { listen };
