const DbInit = require('../DbInit');

/*

  Inits a fresh db with data from json file

*/
module.exports = {

  async up({ db, container, logger })
  {
    const dbInit = container.new(DbInit);

    try {

      const exists = await db.knex.schema.hasTable('users');

      if (exists) {
        logger.log('Bailing, users table already exists.');
        return;
      }

      logger.log('Running db-init now...');
      await dbInit.createTables();
      await dbInit.importData();

    }
    catch (err) {

      logger.log('DB-Init Error: ', err);
      throw err;
    }
  }
};
