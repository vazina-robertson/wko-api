const ref = require('../ref');
let setupLogger = null;
let routeLogger = null;

module.exports = (fn, info, { logger }) => {

  const name = `${info.routeClass}.${info.handler}`;
  const route = `${info.method.toUpperCase()}: '${info.fullPath}'`;
  setupLogger = setupLogger || logger('route-harness');

  setupLogger.log(`mapped | ${name}, ${route}`);

  return async (req, res, next) => {

    routeLogger = routeLogger || logger('route');

    routeLogger
      .kv('params', req.params)
      .kv('query', req.query)
      .kv('route_class', info.routeClass)
      .kv('route_fn', info.handler)
      .log(`${route}, ${name}()`);

    try {
      const r = await fn(req, res);
      if (r) {
        res.send(r);
      }
    }
    catch (err) {
      err = err || new Error();
      err.note = `Error in route. ${name}, ${route}'`.replace(/\'/g, '');
      err.refId = req.refId = ref.newId();

      routeLogger
        .kv('refId', err.refId)
        .kv('params', req.params)
        .kv('query', req.query)
        .kv('route_class', info.routeClass)
        .kv('route_fn', info.handler)
        .kv('note', err.note)
        .error(err);

      next(err);
    }
  };

};
