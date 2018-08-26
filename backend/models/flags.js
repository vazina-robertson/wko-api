/*

  Flags db api

*/
module.exports = class FlagsApi {

  constructor(knex)
  {
    this._knex = knex;
  }

  /*

    Check if a user has the admin flag

  */
  async isAdmin(userId)
  {

    const [ flag ] = await this._knex.from('flags as f')
      .join('user_flags as uf', 'uf.flag_id', 'f.id')
      .join('users as u', 'u.id', 'uf.user_id')
      .where('f.name', 'admin')
      .andWhere('u.id', userId)
      .select('f.*');

    return !!flag;

  }

  async isBrewerAdmin()
  {

    const [ flag ] = await this._knex.from('user_flags as uf')
      .where('uf.user_id', userId)
      .where('uf.flag_id', q => q.from('flags').first('id').where('name', 'brewer-admin'));

    return !!flag;

  }

  /*

    Grant a user the admin flag

  */
  async newAdmin(userId)
  {

    if (!userId) {
      throw new Error('Missing userId param!');
    }

    const flag = await this._getByName('admin');
    await this._knex.into('user_flags').insert({
      user_id: userId,
      flag_id: flag.id
    });

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
