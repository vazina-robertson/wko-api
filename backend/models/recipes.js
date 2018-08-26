/*

  Recipes db api

*/
module.exports = class RecipesApi {

  constructor(knex)
  {
    this._knex = knex;
  }

  /*

    Get all recipes

  */
  async getAll(limit = 20, offset = 0)
  {

    return await this._knex.from('recipes')
      .limit(limit)
      .offset(offset);

  }

}
