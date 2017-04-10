/*

  Sessions db api

*/
module.exports = class SessionsApi {

  constructor(knex)
  {
    this._knex = knex;
  }

  /*

    create a new session (and return result)

  */
  async create(data)
  {
    return await this._knex
      .table('sessions')
      .insert(data)
      .returning('*');
  }

  /*

    get a session by its id or null

  */
  async getById(id)
  {
    if (!id) {
      throw new Error('Missing id param');
    }

    const [ res ] = await this._q(
      this._knex.raw(`id = ${id}`)
    );

    return this._clean(res);
  }

  /*

    get a sessions by user id

  */
  async getAllByUserId(id)
  {
    if (!id) {
      throw new Error('Missing id param');
    }

    const res = await this._q({ id });

    if (!res.length) {
      throw new Error(`Can't find sessions for user id: ${id}`);
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
      .from('sessions')
      .where(w);
  }

  /*

    strip down responses to relevant properties

  */
  _clean(model)
  {
    return {
      id: model.id,
      user_id: model.user_id,
      client_ip: model.client_ip,
      secret: model.secret,
      user_agent: model.user_agent,
      last_activity: model.last_activity
    };
  }

}
