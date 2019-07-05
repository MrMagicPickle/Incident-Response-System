const LED = require('../led');
const Buzzer = require('../buzzer');
const assert = require('assert');

describe('Cancel alarm', function () {
    it('should cancel the alarm', function (done) {
        // Turn on buzzer and LED
        let led = new LED('P8_13');
        led.on();
        let buzzer = new Buzzer('P8_15');
        buzzer.on();
        console.log('Alarm triggered.');
        assert.equal(led.state, 1);
        assert.equal(buzzer.state, 1);

        // Code copied from main.js, lines 90 - 91
        led.off();
        buzzer.off();
        console.log('Alarm turned off.');

        assert.equal(led.state, 0);
        assert.equal(buzzer.state, 0);
        done();
    });
});