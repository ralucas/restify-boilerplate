const WebSocket = require('ws');

module.exports = class SocketServer {
  constructor(config) {
    this._config = Object.assign({
      host: 'localhost',
      port: 8081,
      path: '/ws',
      clientTracking: true
      // TODO: Change these to functions
      // verifyClient: function(){},
      // handleProtocols: function(){}
    }, config);

    this.wss = new WebSocket.Server(this._config, (r) => {
      console.log("Websocket server listening on %s:%s%s",
        this._config.host, this._config.port, this._config.path);
    });
  }

  handleConnections() {
    this.wss.on('connection', function(socket){
      console.log('a user connected');
      socket.ping('connected');
    });
  }

  close(cb) {
    this.wss.close(cb);
  }

};
