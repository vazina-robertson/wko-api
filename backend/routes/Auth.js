
module.exports = class AuthRoutes
{
  constructor({ harness, db, authManager })
  {
    this._db = db;
    this._authManager = authManager;
    harness.post('/login', this.login);
  }


  /*

    Provide login page for testing auth services

  */
  async loginPage()
  {

    res.send(`
      <form>
        <><>
      </form>
    `);
  }

  async login(req)
  {
    const { username, password } = req.body;

    try {
      const success = await this._db.users.checkPassword(username, password);
      if (success) {
        // TODO create new token and store in sessions table
      }
    }
    catch (err) {
      throw new Error('Bad Login Credentials');
    }
  }
};
