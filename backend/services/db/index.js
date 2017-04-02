const DbConnection = require('./DbClient');
const DataApiLoader = require('./DataApiLoader');

/**
 * Inits the knex and db services
 */
module.exports = class DataApiService
{
  constructor(stack)
  {
    // register knex client
    stack.registerInstance('knex', stack.make(DbConnection).getClient());

    // register the data layer api
    this._db = stack.make(DataApiLoader).createApi();
    stack.registerInstance('db', this._db);
  }

  async start()
  {
    await this._db.authenticate();
  }
};
