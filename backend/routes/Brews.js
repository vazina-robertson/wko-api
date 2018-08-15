/*

  Routes for Brews

*/
module.exports = class BrewsRoutes
{
  constructor(db, harness)
  {

    this._db = db;
    const routes = harness(this);

    routes.get('/:id', this.getBrewById);
    routes.get('/', this.getBrews);
    routes.post('/', this.createBrew);
    routes.put('/', this.updateBrew);

  }

  async getBrews()
  {

    return await this._db.brews.getAll();

  }

  async getBrewById(req)
  {

    return await this._db.brews.getById(req.params.id);

  }

  async createBrew(req)
  {

    const data = req.body;

    if (!data.name) {
      throw new Error('name field required');
    }

    return await this._db.brews.create(data);

  }

  async updateBrew()
  {

    const data = req.body;

    const brew = await this._db.brews.checkExists(data.id);

    if (!brew || !brew.id) {
      throw new Error(`Can't find brew with id ${data.id}`);
    }

    return await this._db.brews.update(data);

  }

};
