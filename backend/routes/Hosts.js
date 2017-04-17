/*

  Routes for hosts

*/
module.exports = class Hosts
{
  constructor(db, authManager, harness)
  {
    this._db = db;

    const routes = harness();
    routes.get('/', this.getHosts);

    routes.useInstance('/hosts', [ authManager.middleware() ], this);
  }

  async getHosts()
  {
    return await this._db.hosts.getAll();
  }
};
