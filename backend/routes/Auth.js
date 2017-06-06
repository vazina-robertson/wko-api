
module.exports = class AuthRoutes
{
  constructor(harness, db, authManager)
  {
    this._db = db;
    this._authManager = authManager;
    const routes = harness(this);

    routes.post('/login', this.login);
    routes.get('/login', this.loginPage);
  }


  /*

    Provide login page for testing auth services

  */
  async loginPage()
  {
    return `
      <form action="/auth/login" name="login" method="post">
          <div>
              <label>Username:</label>
              <input type="text" name="username"/>
          </div>
          <div>
              <label>Password:</label>
              <input type="password" name="password"/>
          </div>
          <div>
              <input type="submit" value="login"/>
          </div>
      </form>
    `;
  }

  async login(req)
  {
    const { username, password } = req.body;

    try {

      // check login success
      const success = await this._db.users.checkPassword(username, password);
      if (success) {

        // fetch user
        const user = await this._db.users.getByUsername(username);

        // create new session / token
        const { token } = await this._authManager.createSession(user, req);
        return { token, ok: true };
      }

    }
    catch (err) {
      throw new Error('Bad Login Credentials');
    }
  }
};
