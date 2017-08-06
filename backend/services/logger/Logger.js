const debug = require('debug');
const Raven = require('raven');

class Logger {

  constructor(scope = 'app', sentry = false)
  {

    this._sentry = !!sentry;
    this._logger = debug(scope);
    this._scope = scope;
    this._level = 'info';
    this._buffer = this._newBuffer();

  }

  sentryLevel(l)
  {

    this._level = l;
    return this;

  }

  log(s)
  {

    // check if log aggregation service is enabled
    if (this._sentry) {
      // send to sentry
    }

    // clear the buffer
    this._buffer = this._newBuffer();

    // log the message
    this._logger(s);

    return this;

  }

  error(v)
  {

    if (typeof v === 'string') {
      v = new Error(v);
    }

    if (this._sentry) {
      // send to sentry
    }

    this._buffer = this._newBuffer();
    console.error(v);

  }

  kv(k, v)
  {

    this._buffer.extra.set(k, v);
    return this;

  }

  tag(k, v)
  {

    this._buffer.tags.set(k, v);
    return this;

  }

  _newBuffer()
  {

    return {
      tags: new Map(),
      extra: new Map()
    };

  }
}



/*

  LogManager handles creating new loggers and log aggregation setup

*/
module.exports = class LogManager {

  constructor()
  {

    this._sentry = null;
    this._attemptSentryConnection();

  }

  _attemptSentryConnection()
  {

    const sentry_token = process.env.SENTRY_TK;
    const sentry_project = process.env.SENTRY_PRJ;

    if (!sentry_token) {
      return;
    }

    this.enableSentry(sentry_token, sentry_project);

  }

  factory(scope)
  {

    const logger = new Logger(scope, this._sentry);
    return logger;

  }

  enableSentry(tok, proj)
  {

    if (!tok || !proj) {
      throw new Error('Must provide token and project params');
    }

    Raven.config(`${tok}@sentry.io/${proj}`, {
      captureUnhandledRejections: true,

    }).install();
    this._sentry = true;

  }

};



