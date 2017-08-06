const knexClient = require('knex');
const retry = require('async-retry').default;

/*

  For establishing connection to db

*/
module.exports = class DbClient
{
  constructor(stackConfig, logger)
  {
    this._logger = logger('db:client');
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

      this._logger.kv('attempt', i).log(`connection attempt: ${i}`);
      const res = await this._knex.raw('SELECT version()');

      if (!res || !res.rows) {
        throw new Error('knex failed to connect');
      }

    };
    const factor = 1.5;
    const maxTimeout = 15000;

    this._logger.log('...authenticating with db');
    await retry(task, { maxTimeout, factor });
    this._logger.log('db connection successful!');
  }
};
