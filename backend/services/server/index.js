const Server = require('./Server');
const AuthManager = require('./AuthManager');

module.exports = class ServerService
{

  constructor(container)
  {
    this._container = container;
    const authManager = container.new(AuthManager);
    container.registerValue('authManager', authManager);
  }

  async start()
  {
    const server = this._container.new(Server);
    server.init();
  }

};
