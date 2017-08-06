const Logger = require('./Logger');

/*

  Registers the logger service

*/
module.exports = class LogManager
{

  constructor(container)
  {

    const logger = new Logger();

    // register the logger
    container.registerValue('logger', name => logger.factory(name));

  }

};

