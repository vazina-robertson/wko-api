/*

  Routes for Brews

*/
module.exports = class BrewsRoutes
{
  constructor(db, harness)
  {

    this._db = db;
    const routes = harness(this);

    routes.get('/:id/notes', this.getBrewNoteByBrewId);
    routes.get('/:id', this.getBrewById);
    routes.get('/', this.getBrews);
    routes.post('/:id/note', this.createNewBrewNote);
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

  async getBrewNoteByBrewId(req) {

    const id = req.params.id;
    const exists = await this._db.brews.checkExists(id);

    if (!exists) {
      throw new Error(`Can't find brew with id ${id}`);
    }

    return await this._db.brews.getBrewNoteByBrewId(id);

  }

  async createNewBrewNote(req)
  {

    const id = req.params.id;
    const exists = await this._db.brews.checkExists(id);

    if (!exists) {
      throw new Error(`Can't find brew with id ${id}`);
    }

    const data = req.body;
    if (!data){
      throw new Error('Missing payload for brew_note creation');
    }

    if (!data.brew_id) {
      data.brew_id = id;
    }

    return await this._db.brews.createNewBrewNote(data);

  }

};
