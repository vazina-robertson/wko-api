
const debug = require('debug')('db:model-creation');
module.exports = {

  /**

    create method with table definition

  */
  async create(knex)
  {
    return await knex.schema.createTableIfNotExists('slack_slugs', table => {
      table.increments();
      table.text('name').unique();
    })
    .catch(err => { throw new Error(err); })
    .then(() => debug('slack_slugs table created'));
  },

  /*

    Create associations after tables have been created

  */
  async associate(knex)
  {
    return await knex.schema.table('slack_slugs', table => {

      table.integer('slack_client_id')
        .nullable(false)
        .default(null)
        .references('slack_clients.id');

      // ensure timestamp fields appear last
      table.timestamps(true, true);

    });
  }
};


