// route files
const AuthRoutes = require('../../routes/Auth.js');
const RootRoutes = require('../../routes/Root.js');
const HostsRoutes = require('../../routes/Hosts.js');
const SlackClientsRoutes = require('../../routes/SlackClients.js');
const UsersRoutes = require('../../routes/Users.js');


module.exports = class Routes
{
  constructor(routeHarness, rest, authManager)
  {
    const auth = () => authManager.middleware();

    // un-authed-routes
    routeHarness.mountRoutes('/auth', AuthRoutes);

    // authed-routes (root route goes last as to not doubly call middleware)
    routeHarness.mountRoutes('/hosts', [ auth() ], HostsRoutes);
    routeHarness.mountRoutes('/users', [ auth() ], UsersRoutes);
    routeHarness.mountRoutes('/slack-clients', [ auth() ], SlackClientsRoutes);
    routeHarness.mountRoutes('/', [ auth() ], RootRoutes);

  }
};
