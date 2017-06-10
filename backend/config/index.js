module.exports = Object.assign(
  {},

  // external configs
  require('./server'),
  require('./db'),

  { // overrides
    NODE_ENV: process.env.NODE_ENV || 'development',
    CORE_SERVICES: 'db',
    SERVICES: process.env.SERVICES || '',
    JWT_SECRET: process.env.JWT_SECRET
  }
);
