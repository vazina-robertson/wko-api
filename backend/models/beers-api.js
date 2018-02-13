/*

  Beers db api

*/
module.exports = class BeersApi {

  constructor(knex)
  {
    this._knex = knex;
  }

  /*

    Get all the beers

  */
  async getAll(limit = 20, offset = 0)
  {

    return await this._knex.from('beers')
      .limit(limit)
      .offset(offset);

  }

}
