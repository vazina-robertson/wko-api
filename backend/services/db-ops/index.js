const Umzug = require('umzug');
const path = require('path');
const debug = require('debug')('db:migrations');


/*

  Runs migrations

*/
module.exports = class DbOpsService
{
  constructor(db, container)
  {
    this.um = new Umzug({
      storage: path.join(__dirname, './MigrationStorage.js'),
      storageOptions: { db },
      migrations: {
        path: path.join(__dirname, './migrations'),
        wrap: fn => async () => await fn({ db, container })
      }
    });
  }

  async start()
  {
    const pending = await this.um.pending();
    debug(`currently ${pending.length} pending migrations`);

    // fire

    debug('executing migrations');
    await this.um.up();
    debug('migrations complete');


    // kill when done
    process.exit(0);
  }
};
