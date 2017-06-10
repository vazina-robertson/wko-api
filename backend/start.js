const Application = require('billy');
const config = require('./config');
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
  console.error('Stack boot failure!', err);
  process.exit(1);
}
