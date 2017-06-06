/*

  Routes for hosts

*/
module.exports = class HostsRoutes
{
  constructor(db, harness)
  {
    this._db = db;
    const routes = harness(this);

    routes.get('/', this.getHosts);
  }

  async getHosts()
  {
    return await this._db.hosts.getAll();
  }
};
