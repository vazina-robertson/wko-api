/*

  Routes for hosts

*/
module.exports = class Hosts
{
  constructor(db, harness)
  {
    this._db = db;

    const routes = harness();
    routes.get('/', this.getHosts);

    routes.useInstance('/hosts', this);
  }

  async getHosts()
  {
    return await this._db.hosts.getAll();
  }
};
