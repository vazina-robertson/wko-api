/*

  Routes for slack-clients

*/
module.exports = class SlackClientsRoutes
{
  constructor(db, harness, authManager)
  {
    this._db = db;

    const routes = harness();
    routes.get('/', this.getClients);

    routes.useInstance('/slack-clients', [ authManager.middleware() ], this);
  }

  async getClients()
  {
    return await this._db.slack_clients.getAll();
  }
};
