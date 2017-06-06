const debug = require('debug')('db:migrations:data-dump');
const DbInit = require('../DbInit');

/*

  Inits a fresh db with data from json file

*/
module.exports = {

  async up({ db, container })
  {
    const dbInit = container.new(DbInit);

    try {

      const exists = await db.knex.schema.hasTable('users');

      if (exists) {
        debug('Bailing, users table already exists.');
        return;
      }

      debug('Running db-init now...');
      await dbInit.createTables();
      await dbInit.importData();

    }
    catch (err) {

      debug('DB-Init Error: ', err);
      throw err;
    }
  }
};
