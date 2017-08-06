module.exports = {

  /**

    create method with table definition

  */
  async create(knex, logger)
  {
    return await knex.schema.createTableIfNotExists('slack_clients', table => {
      table.increments();
      table.text('token').unique();
      table.text('name');
      table.text('host');
      table.text('version_path');
      table.timestamps(true, true);
    })
    .catch(err => { throw new Error(err); })
    .then(() => logger.log('slack_clients table created'));
  }
};


