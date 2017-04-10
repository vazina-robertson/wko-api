const debug = require('debug')('db:model-creation');
module.exports = {

  /**

    create method with table definition

  */
  async create(knex)
  {
    return await knex.schema.createTableIfNotExists('user_flags', table => {
      table.increments();
      // this whole table is pretty much associations
    })
    .catch(err => { throw new Error(err); })
    .then(() => debug('user_flags table created'));
  },

  /*

    Create associations after tables have been created

  */
  async associate(knex)
  {
    return await knex.schema.table('user_flags', table => {

      table.integer('flag_id')
          .nullable(false)
          .default(null)
          .references('flags.id');

      table.integer('user_id')
          .nullable(false)
          .default(null)
          .references('users.id');

      // do timestamp fields appear last
      table.timestamps(true, true);

    })
  }
};


