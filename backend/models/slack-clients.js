/*

  SlackClients db api

*/
module.exports = class SlackClientsApi {

  constructor(knex)
  {
    this._knex = knex;
  }

  /*

    get all slack_clients in db

  */
  async getAll()
  {
    const rows = await this._q();
    return rows.map(r => this._clean(r));
  }

  /*

    get a slack_client by token

  */
  async getByToken(token)
  {
    if (!token) {
      throw new Error('Missing token param');
    }

    const [ res ] = await this._q({ token });

    if (!res) {
      throw new Error(`Can't find host with token: ${token}`);
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
      .from('slack_clients')
      .where(w);
  }

  /*

    strip down responses to relevant properties

  */
  _clean(model)
  {
    return {
      id: model.id,
      token: model.token,
      name: model.name,
      data: model.data
    };
  }

};
