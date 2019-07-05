/*
    Unit test for LED.
    mocha site package used.
*/

const assert = require('assert');
const LED = require('../led.js');

let ledObject = new LED('P8_13');

describe('LED', function () {
  describe('state', function () {
    it('should return 0 upon init or LED being off', function (done) {
      assert.equal(ledObject.state, 0);
      done();
    });
  });

  describe('on()', function () {
    it('state should be 1 after turning on LED', function (done) {
      ledObject.on();
      assert.equal(ledObject.state, 1);
      done();
    });
  });

  describe('off()', function () {
    it('state should be 0 after turning off LED', function (done) {
      ledObject.off();
      assert.equal(ledObject.state, 0);
      done();
    });
  });

  describe('toggle()', function () {
    it('final LED state should be opposite of current LED state', function (done) {
      let currentState = ledObject.state;
      ledObject.toggle();
      assert.equal(ledObject.state, !currentState);
      done();
    });
  });
});