const TNAME = '$migrations';

/*

  Implement the storage mechanism for Umzug migrations

*/
module.exports = class MigrationStorage
{
  constructor(options)
  {
    if (!options || !options.storageOptions || !options.storageOptions.db) {
      throw new Error('Must provide options.storageOptions.db instance');
    }
    const { db, logger } = options.storageOptions;

    this._db = db.knex;
    this._logger = logger('db:MigrationStorage');
  }

  async logMigration(name)
  {
    await this._ensureTable();
    await this._db(TNAME).insert({ date: new Date(), name });
    this._logger.log(`Completed migration: ${name}`);
  }

  async unlogMigration()
  {
    throw new Error('Not Implemented');
  }

  async executed()
  {
    await this._ensureTable();
    const rows = await this._db(TNAME).select();
    return rows.map(x => x.name);
  }

  async _ensureTable()
  {
    if (await this._db.schema.hasTable(TNAME)) {
      return;
    }

    await this._db.schema.createTable(TNAME, table => {
      table.text('name').primary();
      table.dateTime('date').notNullable();
    });

    this._logger.log('Created migration meta table');
  }
};
