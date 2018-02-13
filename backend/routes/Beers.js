/*

  Routes for Beers

*/
module.exports = class BeersRoutes
{
  constructor(db, harness)
  {

    this._db = db;
    const routes = harness(this);

    routes.get('/', this.getBeers);

  }

  async getBeers()
  {

    return await this._db.beers.getAll();

  }
};
