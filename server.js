
if (process.env.NODE_ENV !== 'production'){
  require('longjohn');
}

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const restify = require('restify');
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

