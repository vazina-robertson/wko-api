const Server = require('./Server');
const AuthManager = require('./AuthManager');

module.exports = class ServerService
{

  constructor(stack)
  {
    this._stack = stack;
    const authManager = stack.make(AuthManager);
    stack.registerInstance('authManager', authManager);
  }

  async start()
  {
    const server = this._stack.make(Server);
    server.init();
  }

};
