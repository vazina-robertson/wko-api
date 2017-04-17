const uuid = require('uuid');
const bcrypt = require('bcrypt');
const debug = require('debug')('app:AuthManager');
const jwt = require('jsonwebtoken');

// How many bcrypt rounds to run
const SALT_ROUNDS = 11;

// 10 year expiring forever
const FOREVER = 60 * 60 * 24 * 365.25 * 10;
const SESSION_TOKEN_EXPIRES = FOREVER;

module.exports = class AuthManager
{
  constructor(db, stackConfig)
  {
    this._db = db;
    this._config = stackConfig;
  }

  /*

    Generate an express middleware that checks auth

  */
  middleware(required = true)
  {
    return async (req, res, next) => {

      // early out if already there
      if (req.session) {
        next();
        return;
      }

      req.session = null;

      const header = req.headers['authorization'] || '';
      const match = header.match(/^(bearer|jwt) (.*)$/i);

      if (required && !match) {
        next({ message: 'Unauthorized', statusCode: 401 });
        return;
      }

      if (match) {
        const [ , , token ] = match;
        const session = await this.getSessionFromToken(token);

        if (required && !session) {
          next({ message: 'Unauthorized', statusCode: 401 });
          return;
        }

        // debug(`[userAuth] authenticating user ${session.user_id}: ok!`);
        req.session = session;
        req.user = await this.getUserFromSession(session);
      }

      next();
    };
  }

  /*

    Middleware that requires the user to be an admin

  */
  adminMiddleware()
  {
    return async (req, res, next) => {

      if (!req.session) {
        next({ message: 'Unauthorized', statusCode: 401 });
        return;
      }

      const adminFlag = await this._db.flags.getByName('admin');
      const [ flag ] = await this._db
        .table('user_flags')
        .where({
          user_id: req.session.user_id,
          flag_id: adminFlag.id
        });

      if (!flag) {
        next({ message: 'Forbidden', statusCode: 403 });
        return;
      }

      next();
    };
  }

  /*

    Create a new session

  */
  async createSession(user, req)
  {
    // Pull out info from the http request
    const client_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const user_agent = req.headers['user-agent'];

    // Generate pointer secret (encrypted val stored in db & un-encrypted
    // val attached to claims in token for checking against val in db)
    const ptSecret = uuid.v4();
    const secret = await bcrypt.hash(ptSecret, SALT_ROUNDS);

    const date = new Date();

    const model = {
      id: uuid.v4(),
      user_id: user.id,
      secret,
      client_ip,
      user_agent,
      last_activity: date
    };

    const [ session ] = await this._db.sessions.create(model);

    const claims = { secret: ptSecret, user_id: user.id };
    const token = this.createJwt(session.id, claims, SESSION_TOKEN_EXPIRES);

    return { session, token };
  }


  /*

    Resolve a session from a jwt

  */
  async getSessionFromToken(token)
  {
    try {

      // for now, not checking secret, just trusting signed token
      const { sub: id } = jwt.decode(token, this._config.JWT_SECRET);

      const session = await this._db.sessions.getById(id);

      if (!session) {
        return null;
      }

      await this._db.sessions.newActivity(session);

      return session;

    }
    catch (err) {
      return null;
    }
  }

  /*

    Chill

  */
  async getUserFromSession(session)
  {
    if (!session) {
      throw new Error('Missing parameter');
    }

    const { user_id } = session;

    const user = await this._db.users.getById(user_id);

    return user;
  }

  /*

    Create a signed JWT

  */
  createJwt(sub, claims = { }, expiresIn = 60 * 60)
  {
    if (!sub) {
      throw new Error('Missing parameter');
    }

    if (claims.sub) {
      throw new Error('Cannot overwrite sub claim in claims parameter');
    }

    const options = { expiresIn };
    const payload = Object.assign({ }, claims, { sub });

    return jwt.sign(payload, this._config.JWT_SECRET, options);
  }

};

