const assert = require('assert');
const socket = require('socket.io-client');
const webdriver = require('selenium-webdriver');

// Selenium webdriver
let driver;
let By = webdriver.By
let until = webdriver.until;
// Start socket.io client
let socketClient;

describe('Alarm duration', function () {
  beforeEach(function () {
    // Connect to client page
    socketClient = socket('http://localhost:4444/', {
      'force new connection': true
    });

    // Build selenium object
    driver = new webdriver.Builder().forBrowser('firefox').build();
  });

  afterEach(function () {
    socketClient.disconnect();
  });

  it('should emit an object with AlarmDuration', function (done) {
    socketClient.on('broadcast', function (data) {
      assert.notEqual(data.alarmDuration, undefined);
      done();
    });

    // Selenium web driver
    driver.get('http://localhost:4444/')
    // Click ALARM button
    let setAlarmDuration = driver.findElement(By.id('alarm'));
    setAlarmDuration.click();
    // Select and emit event
    let emitAlarmButton = driver.findElement(By.id('alarmWithDuration'));
    emitAlarmButton.click();
  }).timeout(10000);
});