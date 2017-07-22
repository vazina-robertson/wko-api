const curry = require('./index.js');

const hello = (a, b) => {
  console.log(`Hello, ${a} ${b}`);
};

const mr = curry(hello, 'Mr.');



mr('Foo');
mr('Bar');

