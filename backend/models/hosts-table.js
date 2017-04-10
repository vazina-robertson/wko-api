const debug = require('debug')('db:model-creation');
module.exports = {

  /**

    create method with table definition

  */
  async create(knex)
  {
    return await knex.schema.createTableIfNotExists('hosts', table => {
      table.increments();
      table.string('name').unique();
      table.string('address').unique();
      table.string('type');
      table.timestamps(true, true);
    })
    .catch(err => { throw new Error(err); })
    .then(() => debug('hosts table created'));
  }
};


