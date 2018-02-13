
/*

  Adds the beer and recipe tables

*/
module.exports = {

  async up({ db, logger })
  {

    await db.knex.schema.createTableIfNotExists('beers', table => {
      table.increments();
      table.string('name');
      table.timestamps(true, true);
    })
    .catch(err => { throw new Error(err); })
    .then(() => logger.log('beers table created'));

  }
};
