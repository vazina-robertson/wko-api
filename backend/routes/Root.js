
module.exports = class RootRoutes
{
  constructor(harness, db, authManager)
  {
    this._db = db;
    const routes = harness();
    routes.get('/', this.getIndex);

    routes.useInstance('/', [ authManager.middleware() ], this);
  }

  async getIndex()
  {
    return `
    <h1>stack</h1>
    <h3>
      <ul>
        <li><a href="/users">users</a></li>
        <li><a href="/slack-clients">slack_clients</a></li>
        <li><a href="/hosts">hosts</a></li>
      </ul>
    </h3>
    `;
  }

};
