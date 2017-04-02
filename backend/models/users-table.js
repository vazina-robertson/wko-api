const debug = require('debug')('db:model-creation');
module.exports = {

  /**

    create method with table definition

  */
  async create(knex)
  {
    return await knex.schema.createTableIfNotExists('users', table => {
      table.increments();
      table.string('first_name');
      table.string('last_name');
      table.string('username').unique();
      table.string('password');
      table.string('email');

      // associate optional host_id to hosts table
      table.integer('host_id')
          .nullable(true)
          .default(null)
          .references('hosts.id');

      table.timestamps();
    })
    .catch(err => { throw new Error(err); })
    .then(() => debug('users table created'));
  }
};


