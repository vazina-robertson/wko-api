const knexClient = require('knex');
const retry = require('async-retry').default;
const debug = require('debug')('db:client');

/*

  For establishing connection to db

*/
module.exports = class DbClient
{
  constructor(stackConfig)
  {
    this._knex = knexClient(stackConfig.db);
    this._knex.authenticate = async () => await this.authenticate();
  }

  /*

    Retrieve the knex instance

  */
  getClient()
  {
    return this._knex;
  }

  /*

    Ensure knex has successfully connected to db, else throw if not

  */
  async authenticate()
  {
    const task = async (exit, i) => {

      debug(`connection attempt: ${i}`);
      const res = await this._knex.raw('SELECT version()');

      if (!res || !res.rows) {
        throw new Error('knex failed to connect');
      }

    };
    const factor = 1.5;
    const maxTimeout = 15000;

    debug('...authenticating with db');
    await retry(task, { maxTimeout, factor });
    debug('db connection successful!');
  }
};