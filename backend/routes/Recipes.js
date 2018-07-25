/*

  Routes for Recipes

*/
module.exports = class RecipesRoutes
{
  constructor(db, harness)
  {

    this._db = db;
    const routes = harness(this);

    routes.get('/', this.getRecipes);

  }

  async getRecipes()
  {

    return await this._db.recipes.getAll();

  }
};
