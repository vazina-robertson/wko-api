const Application = require('billy');
const config = require('./config');
const LogManager = require('./services/logger/Logger');
const strToArr = require('utils').strToArr;

const stack = new Application();

try {

  // register the config
  stack.container.registerValue('stackConfig', config);

  // register services via environment variables
  const services = [
    ...strToArr(config.CORE_SERVICES),
    ...strToArr(config.SERVICES)
  ];

  for (let svc of services) {
    stack.service(require(`./services/${svc}`));
  }

  // start the app
  stack.start();
}
catch (err) {

  const lm = new LogManager();
  const logger = lm.factory('app');
  logger
    .kv('note', 'stack boot failure')
    .error(err);
  process.exit(1);

}
