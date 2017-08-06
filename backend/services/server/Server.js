const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Harness = require('route-harness');
const express = require('express');

const listener = require('./listener');


module.exports = class Server
{
  constructor(stackConfig, container, db, authManager, logger)
  {
    this._config = stackConfig;
    this._container = container;
    this._logger = logger;
    this._db = db;
    this._app = express();
    this._auth = authManager;
    this._container.registerValue('rest', this._app);
  }

  init()
  {
    this._app.use(bodyParser.json());
    this._app.use(bodyParser.urlencoded({ extended: false }));
    this._app.use(cookieParser());

    // init the harness
    const harness = new Harness(this._app);

    // use billy as a custom factory for the route harness
    const harnessOpts = Object.assign({}, this._config.harness, {
      factory: T => this._container.new(T),
      inject: { logger: this._logger }
    });

    harness.configure(harnessOpts);

    // register the harness
    this._container.registerValue('harness', harness.restHarness);
    this._container.registerValue('routeHarness', harness);
  }

  listen()
  {
    this._initErrorHandlers();
    listener.listen(this._app, this._config.PORT, this._logger('server:listener'));
  }

  _initErrorHandlers()
  {
    // catch 404 and forward to error handler
    this._app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // development error handler
    // will print stacktrace
    if (this._config.NODE_ENV === 'development') {
      this._app.use(function(err, req, res, next) { // eslint-disable-line
        res.status(err.status || 500);
        res.send({ message: err.message, error: err });
      });
    }

    // production error handler
    // no stacktraces leaked to user
    this._app.use(function(err, req, res, next) { // eslint-disable-line
      res.status(err.status || 500);
      res.send({ message: err.message });
    });
  }
};
