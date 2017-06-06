const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Harness = require('route-harness');
const express = require('express');

const listener = require('./listener');
const Routes = require('../../routes');

module.exports = class Server
{
  constructor(stackConfig, container, db)
  {
    this._config = stackConfig;
    this._container = container;
    this._db = db;
    this._app = express();
  }

  init()
  {
    this._app.use(bodyParser.json());
    this._app.use(bodyParser.urlencoded({ extended: false }));
    this._app.use(cookieParser());

    const harness = new Harness(this._app, this._config.harness);
    this._container.registerValue('harness', harness.factory);

    for (let Route of Routes) {
      this._container.new(Route);
    }

    this._initErrorHandlers();
    listener.listen(this._app, this._config.PORT);
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
