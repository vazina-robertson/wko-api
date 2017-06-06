const Application = require('billy');
const config = require('./config');
const strToArr = require('utils').strToArr;

const stack = new Application();

try {

  const services = [
    ...strToArr(config.CORE_SERVICES),
    ...strToArr(config.SERVICES)
  ];

  for (let svc of services) {
    stack.service(require(`./services/${svc}`));
  }

  stack.start();
}
catch (err) {
  console.error('Stack boot failure!', err);
  process.exit(1);
}
