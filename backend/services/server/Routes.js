// route files
const AuthRoutes = require('../../routes/Auth.js');
const RootRoutes = require('../../routes/Root.js');
const HostsRoutes = require('../../routes/Hosts.js');
const SlackClientsRoutes = require('../../routes/SlackClients.js');
const UsersRoutes = require('../../routes/Users.js');
const BeersRoutes = require('../../routes/Beers.js');
const BrewsRoutes = require('../../routes/Brews.js');
const RecipesRoutes = require('../../routes/Recipes.js');


module.exports = class Routes
{
  constructor(routeHarness, rest, authManager)
  {

    const auth = () => authManager.middleware();

    // un-authed-routes
    routeHarness.mountRoutes('/auth', AuthRoutes);
    routeHarness.mountRoutes('/', RootRoutes);
    routeHarness.mountRoutes('/beers', BeersRoutes);

    // authed-routes
    routeHarness.mountRoutes('/hosts', [ auth() ], HostsRoutes);
    routeHarness.mountRoutes('/users', [ auth() ], UsersRoutes);
    routeHarness.mountRoutes('/slack-clients', [ auth() ], SlackClientsRoutes);
    routeHarness.mountRoutes('/brews', [ auth() ], BrewsRoutes);
    routeHarness.mountRoutes('/recipes', [ auth() ], RecipesRoutes);

  }
};
