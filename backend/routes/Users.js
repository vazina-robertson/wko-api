
module.exports = class UsersRoutes
{
  constructor(harness, db)
  {
    this._users = db.users;

    const routes = harness();
    routes.get('/', this.fetchAll);
    routes.get('/:id', this.fetchById);

    routes.useInstance('/users', this);
  }

  async fetchAll()
  {
    return await this._users.getAll();
  }

  async fetchById(req)
  {
    const id = req.params.id;
    return await this._users.getById(id);
  }
};
