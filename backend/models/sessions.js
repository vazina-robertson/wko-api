/*

  Sessions db api

*/
module.exports = class SessionsApi {

  constructor(knex)
  {
    this._sessions = () => knex.table('sessions');
  }

  /*

    create a new session (and return result)

  */
  async create(data)
  {
    return await this._sessions()
      .insert(data)
      .returning('*');
  }

  /*

    update the last_activity for a session with given id

  */
  async newActivity(id)
  {
    if (!id) {
      throw new Error('Missing param id');
    }

    await this._sessions()
        .update({ last_activity: new Date() })
        .where({ id })
  }

  /*

    get a session by its id or null

  */
  async getById(id)
  {
    if (!id) {
      throw new Error('Missing id param');
    }

    const [ res ] = await this._q({ id });

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
    return await this._sessions()
      .select('*')
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
