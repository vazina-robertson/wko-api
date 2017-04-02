const debug = require('debug')('db:model-creation');
module.exports = {

  /**

    create method with table definition

  */
  async create(knex)
  {
    return await knex.schema.createTableIfNotExists('slack_clients', table => {
      table.increments();
      table.text('token').unique();
      table.text('name');
      table.jsonb('data');
      table.timestamps();
    })
    .catch(err => { throw new Error(err); })
    .then(() => debug('slack_clients table created'));
  }
};


