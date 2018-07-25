/*

  Routes for Brews

*/
module.exports = class BeersRoutes
{
  constructor(db, harness)
  {

    this._db = db;
    const routes = harness(this);

    routes.get('/', this.getBrews);
    routes.get('/:id', this.getBrewById);

  }

  async getBrews()
  {

    return await this._db.brews.getAll();

  }

  async getBrewById(req)
  {

    return await this._db.brews.getById(req.params.id);

  }

};
