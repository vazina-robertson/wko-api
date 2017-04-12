const fs = require('fs');

const files = fs.readdirSync(__dirname);
const routes = files.filter(f => f !== 'index.js');


module.exports = routes.map(r => require(`./${r}`));

