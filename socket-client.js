var io = require('socket.io-client');
var request = require('request');

/** Class that acts as a client to the socket-io server. */
class Client {
  /**
   * Create a Client object.
   * Connect the Client object to the server.
   * @param {string} serverUrl - URL to the server
   */
  constructor(serverUrl = 'http://localhost:4444') {
    this.socket = io(serverUrl);

    // Arrow functions used to preserve 'this' context.
    this.socket.on('connect', () => {
      // Emit that BB is connected to socket server.
      this.socket.emit('BB connect');
    });
  }

  /**
   * Send a message to the server.
   * @param {object} data - Object to be sent to the server.
   */
  broadcast(data) {
    this.socket.emit('broadcast', data);
  }

  /**
   * Decide what happen when 'broadcast' event is received from server.
   * @param {function} callback - A function which will be called when event is received.
   */
  onReceive(callback) {
    this.socket.on('broadcast', (data) => {
      // 2 methods to calculate the latency
      // Date.now() depends on the time delay in BB
      // World Time API might cost more in calling the API

      /* ============================================================== */
      data.received = Date.now();
      console.log('Latency:', data.received - data.sent);
      this.socket.emit('broadcast', data);
      callback(data);
      /* ============================================================== */
      // console.log(), this.socket.emit() and callback() 
      // has to be called as a callback for request() because it is async
      // let apiUrl = 'http://worldtimeapi.org/api/timezone/Asia/Kuala_Lumpur';
      // request(apiUrl, ((err, response, body) => {
      //   data.received = Date.parse(JSON.parse(body).datetime);
      //   console.log('Latency:', data.received - data.sent);
      //   this.socket.emit('broadcast', data);
      //   callback(data);
      // }).bind(this));
      /* ============================================================== */
    });
  }
}

module.exports = Client;
