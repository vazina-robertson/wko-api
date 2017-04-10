const debug = require('debug')('db:init');
const path = require('path');
const fs = require('fs');

// bring in sample data
const data = require('./sample-data.json');

// get table definition files
const modelsPath  = path.join(__dirname, '../../models');
const modelFiles = fs.readdirSync(modelsPath);
const tableFiles = modelFiles
  .filter(file => file.slice(-9) === '-table.js');

/*

  Adjust the host_id mappings for users data to be dynamic based
  on the hosts array ordering (using 0 based indexing in json file)

*/
const hostIdFns = data.hosts.map(({ name }) =>
  q => q.from('hosts').select('id').where({ name })
);
data.users = data.users.map(user => {
  user.host_id = hostIdFns[user.host_id];
  return user;
});

/**
 * Creates db tables and imports data to db
 */
module.exports = class DbInit
{
  constructor(knex, db)
  {
    this._knex = knex;
    this._db = db;
  }

  /**
   * Create the db schema
   */
  async createTables()
  {
    debug('Creating db tables now...');

    const defs = tableFiles.map(f => require(path.join(modelsPath, f)));

    for (let def of defs) {
      await def.create(this._knex);
    }

    // associate any models that need it
    for (let def of defs) {
      if (typeof def.associate === 'function') {
        await def.associate(this._knex);
      }
    }

    debug('Tables created successfully!');
  }

  async _importFlags()
  {
    for (let flag of data.flags) {
      await this._knex
        .insert(flag)
        .into('flags');
    }
  }

  async _importUserFlags()
  {
    const userRefs = data.users.map(u => q => q.select('id').from('users').where({ username: u.username }));
    const flagRefs = data.flags.map(f => q => q.select('id').from('flags').where({ name: f.name }));

    for (let uf of data.user_flags) {
      await this._knex.insert({
        flag_id: flagRefs[uf.flag_id],
        user_id: userRefs[uf.user_id]
      })
      .into('user_flags');
    }
  }

  /*

    Import slack client data to db

  */
  async _importSlackClients()
  {
    // add slack_clients
    for (let sc of data.slack_clients) {
      await this._knex
        .insert(sc)
        .into('slack_clients');
    }
  }

  /*

    Import host data to db

  */
  async _importHosts()
  {
    // add hosts
    for (let host of data.hosts) {
      await this._knex
        .insert(host)
        .into('hosts');
    }
  }

  /*

    Import user data to db

  */
  async _importUsers()
  {
    // add users
    for (let user of data.users) {
      const { password } = user;
      delete user.password;
      await this._knex
        .insert(user)
        .into('users');
      this._db.users.setPassword(user.username, password);
    }
  }

 /**
  * Add static json data to db
  */
  async importData()
  {
    debug('Adding db-init data to database');

    // run db data insertions
    await this._importFlags();
    await this._importHosts();
    await this._importUsers();
    await this._importSlackClients();
    await this._importUserFlags();

    debug('DB-Init import Succeeded!');
  }
};
