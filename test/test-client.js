/*
    Unit test for connection of socket.
    mocha site package used.
*/

const assert = require('assert');
const socket = require('socket.io-client');

let socketClient;

describe('Client page', function () {
  beforeEach(function () {
    socketClient = socket('http://localhost:4444', {
      'force new connection': true
    });
  });

  afterEach(function () {
    socketClient.disconnect();
  });

  it('should connect to socket.io server', function (done) {
    socketClient.on('connect', function () {
      assert.equal(socketClient.connected, true);
      done();
    });
  });
});