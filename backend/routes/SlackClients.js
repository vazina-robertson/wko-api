/*

  Routes for slack-clients

*/
module.exports = class SlackClientsRoutes
{
  constructor(db, harness)
  {
    this._db = db;
    const routes = harness(this);

    routes.get('/', this.getClients);
  }

  async getClients()
  {
    return await this._db.slack_clients.getAll();
  }
};
