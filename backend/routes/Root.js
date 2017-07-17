
module.exports = class RootRoutes
{
  constructor(harness, db, stackConfig)
  {
    this._db = db;
    this._config = stackConfig;
    const routes = harness(this);

    routes.get('/', this.getIndex);
    routes.get('/version', this.getVersion);
  }

  async getIndex()
  {
    return { ok: true };
  }

  getVersion()
  {
    return {
      version: this._config.build.version,
      timestamp: this._config.build.timestamp
    };
  }

};
