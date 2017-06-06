const DbConnection = require('./DbClient');
const DataApiLoader = require('./DataApiLoader');

/**
 * Inits the knex and db services
 */
module.exports = class DataApiService
{
  constructor(container)
  {
    // register knex client
    container.registerValue('knex', container.new(DbConnection).getClient());

    // register the data layer api
    this._db = container.new(DataApiLoader).createApi();
    container.registerValue('db', this._db);
  }

  async start()
  {
    await this._db.authenticate();
  }
};
