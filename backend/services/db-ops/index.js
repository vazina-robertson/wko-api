const Umzug = require('umzug');
const path = require('path');


/*

  Runs migrations

*/
module.exports = class DbOpsService
{
  constructor(db, container, logger)
  {
    this._logger = logger('db:migrations');
    this.um = new Umzug({
      storage: path.join(__dirname, './MigrationStorage.js'),
      storageOptions: { db, logger },
      migrations: {
        path: path.join(__dirname, './migrations'),
        wrap: fn => async () => await fn({ db, container, logger: this._logger })
      }
    });
  }

  async start()
  {
    const pending = await this.um.pending();
    this._logger.log(`currently ${pending.length} pending migrations`);

    // fire

    this._logger.log('executing migrations');
    await this.um.up();
    this._logger.log('migrations complete');


    // kill when done
    process.exit(0);
  }
};
