module.exports = {

  /**

    create method with table definition

  */
  async create(knex, logger)
  {
    return await knex.schema.createTableIfNotExists('sessions', table => {
      table.string('id').primary().unique(true);

      table.string('secret').nullable(false).default(null);
      table.string('client_ip');
      table.string('user_agent');
      table.date('last_activity');

    })
    .catch(err => { throw new Error(err); })
    .then(() => logger.log('sessions table created'));
  },

  /*

    add associations after tables have been created

  */
  async associate(knex)
  {
    return await knex.schema.table('sessions', table => {

      table.integer('user_id')
          .nullable(true)
          .default(null)
          .references('users.id');

      // put timestamp fields last
      table.timestamps(true, true);
    });
  }
};


