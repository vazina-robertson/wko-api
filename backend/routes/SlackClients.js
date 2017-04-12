/*

  Routes for slack-clients

*/
module.exports = class SlackClientsRoutes
{
  constructor(db, harness)
  {
    this._db = db;

    const routes = harness();
    routes.get('/', this.getClients);

    routes.useInstance('/slack-clients', this);
  }

  async getClients()
  {
    return await this._db.slack_clients.getAll();
  }
};
