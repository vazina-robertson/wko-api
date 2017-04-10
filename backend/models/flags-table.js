const debug = require('debug')('db:model-creation');
module.exports = {

  /**

    create method with table definition

  */
  async create(knex)
  {
    return await knex.schema.createTableIfNotExists('flags', table => {
      table.increments();
      table.string('name');
      table.string('description');
      table.timestamps(true, true);
    })
    .catch(err => { throw new Error(err); })
    .then(() => debug('flags table created'));
  }
};


