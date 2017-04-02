/*

  Routes for slack-clients

*/
module.exports = class SlackClientsRoutes
{
  constructor({ db, harness })
  {
    this._db = db;

    harness.get('/', this.getClients);
  }

  async getClients()
  {
    return await this._db.slack_clients.getAll();
  }
};