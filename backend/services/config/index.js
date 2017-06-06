const config = require('../../config');

/**
 * Registers the stackConfig
 */
module.exports = class StackConfig
{
  constructor(container)
  {
    container.registerValue('stackConfig', config);
  }
};
