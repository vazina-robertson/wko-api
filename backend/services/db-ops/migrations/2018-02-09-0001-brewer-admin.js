
/*

  Adds the brewer-admin flag if not already in db

*/
module.exports = {

    async up({ db, logger })
    {

      const [ exists ] = await db.knex
        .from('flags')
        .where({ name: 'brewer-admin' });

      if (exists) {
        logger.log('brewer-admin flag exists √');
        return;
      }

      await db.knex
        .insert({ name: 'brewer-admin', description: 'Can access wko.beer admin sections' })
        .into('flags');

      logger.log('added brew-admin flag');

    }
};