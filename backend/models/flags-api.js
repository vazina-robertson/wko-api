/*

  Flags db api

*/
module.exports = class FlagsApi {

  constructor(knex)
  {
    this._knex = knex;
  }

  /*

    get all flags in db

  */
  async getAll()
  {
    const rows = await this._q();
    return rows.map(r => this._clean(r));
  }

  /*

    get a flag by name

  */
  async getByName(name)
  {
    if (!name) {
      throw new Error('Missing name param');
    }

    const [ res ] = await this._q({ name });

    if (!res) {
      throw new Error(`Can't find flag by name: ${name}`);
    }

    return this._clean(res);
  }

  /*

    run a basic query

  */
  async _q(w = {})
  {
    return await this._knex
      .select('*')
      .from('flags')
      .where(w);
  }

  /*

    strip down responses to relevant properties

  */
  _clean(model)
  {
    return {
      id: model.id,
      name: model.name,
      description: model.description
    };
  }

}
