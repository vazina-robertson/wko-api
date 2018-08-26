/*

  Hosts db api

*/
module.exports = class HostsApi {

  constructor(knex)
  {
    this._knex = knex;
  }

  /*

    get all hosts in db

  */
  async getAll()
  {
    const rows = await this._q();
    return rows.map(r => this._clean(r));
  }

  /*

    get a host by id

  */
  async getById(id)
  {
    if (!id) {
      throw new Error('Missing id param');
    }

    const [ res ] = await this._q({ id });

    if (!res) {
      throw new Error(`Can't find host with id: ${id}`);
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
      .from('hosts')
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
      address: model.address,
      type: model.type
    };
  }

};
