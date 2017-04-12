
module.exports = class AuthRoutes
{
  constructor(harness, db, authManager)
  {
    this._db = db;
    this._authManager = authManager;

    const routes = harness();
    routes.post('/login', this.login);
    routes.get('/login', this.loginPage);

    routes.useInstance('/auth', this);
  }


  /*

    Provide login page for testing auth services

  */
  async loginPage()
  {

    res.send(`
      <form action="/login" method="post">
          <div>
              <label>Username:</label>
              <input type="text" name="username"/>
          </div>
          <div>
              <label>Password:</label>
              <input type="password" name="password"/>
          </div>
          <div>
              <input type="submit" value="Log In"/>
          </div>
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
