const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');

const dest = path.join(__dirname, '/config/build-info.json');
const date = new Date();
const version = {
  version: pkg.version,
  timestamp: date.toISOString()
};


fs.writeFileSync(dest, JSON.stringify(version, null, 2));



