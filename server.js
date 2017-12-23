
if (process.env.NODE_ENV !== 'production'){
  require('longjohn');
}

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const restify = require('restify');
const plugins = restify.plugins;
const logger = require('morgan');

const config = require('./config');
const mw = require('./middleware');
const routes = require('./routes');
const WebSocketServer = require('./socket');

//TODO: Abstract console api to use bunyan logging

module.exports = class Server {
  constructor() {
    this._config = config.get('server');

    this.server = restify.createServer({
      //certificate: fs.readFileSync('config/certs/server.crt'),
      //key: fs.readFileSync('config/certs/server.key'),
      name: this._config.name
    });
  }

  setMiddleware() {
    // TODO: Move ignorePaths to config
    const ignorePaths = [ '/heartbeat' ];

    // Middleware
    this.server.use(logger('dev'));
    this.server.pre(plugins.pre.context());
    this.server.pre(plugins.pre.pause());
    this.server.pre(plugins.pre.sanitizePath());
    this.server.pre(plugins.pre.reqIdHeaders({ headers: ['x-request-id'] }));
    this.server.pre(plugins.pre.strictQueryParams());
    this.server.pre(plugins.pre.userAgentConnection());

    // Restify plugins
    this.server.use(plugins.acceptParser(this.server.acceptable));
    this.server.use(plugins.authorizationParser());
    this.server.use(plugins.dateParser());
    this.server.use(plugins.queryParser());
    // this.server.use(plugins.jsonp());
    this.server.use(plugins.gzipResponse());
    this.server.use(plugins.bodyParser());
    this.server.use(plugins.requestExpiry({
      startHeader: 'x-request-expiry-start',
      timeoutHeader: 'x-request-expiry-time'
    }));
    this.server.use(plugins.requestLogger());
    // Use Lusca to prevent some common attacks
    this.server.use(mw.websec());
    this.server.use(mw.authorize(ignorePaths));

    return this.server;
  }

  setRoutes() {
    routes(this.server);

    return this.server;
  }

  startServer() {
    this.setMiddleware();
    this.setRoutes();

    if (cluster.isMaster && process.env.NODE_ENV == 'production') {
      // Fork workers.
      for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        console.log('Worker ' + worker.process.pid + ' died:\n' +
          'code: ' + code + ' signal: ' + signal);
      });

    } else {
      this.server.listen(this._config.port, () => {
        console.log('%s listening at %s', this.server.name, this.server.url);
      });
    }
    return this.server;
  }

  startSockets() {
    this.wss = new WebSocketServer(this.server, config.get('socket'));
    this.wss.handleConnections();
  }

  run() {
    this.startServer();
    this.startSockets();
    return {
      server: this.server,
      wss: this.wss
    };
  }

};

