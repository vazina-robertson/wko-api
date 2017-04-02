/*

  Routes for hosts

*/
module.exports = class Hosts
{
  constructor({ db, harness })
  {
    this._db = db;
    harness.get('/', this.getHosts);
  }

  async getHosts()
  {
    return await this._db.hosts.getAll();
  }
};
