var b = require('bonescript');
var request = require('request');

const Button = require('./button.js');
const Led = require('./led.js');
const SocketClient = require('./socket-client.js');
const Buzzer = require('./buzzer.js');

// WAITING: Receive a short press to activate the program and a long press to cancel message input.
// RUNNING: Receive combination of short and long presses.
var state = {
  'WAITING': 0,
  'RUNNING': 1
};

// Cannot start with '-' because if the first press is '-', then it will be cancelled.
// '.' represents a short press.
// '-' represents a long press.
let combination = {
  '.': 'Robbery',
  '..': 'Fire',
  '.-': 'Disgruntled customer'
};

/** Main program */
class Main {
  /** @constructor */
  constructor() {
    this.currentState = state.WAITING;

    this.accumulator = '';

    console.log("Creating client");
    this.client = new SocketClient();
    console.log("Client created");

    this.btn = new Button('P8_19');
    this.led = new Led('P8_13');
    this.buzzer = new Buzzer('P8_15');

    this.msgTimeout;
    this.blinkTimer;
  }

  /**
   * Attach short and long button press event.
   * Attach onReceive event when client receives message from server.
   */
  run() {
    // Bind is required to pass this.shortPressEvent as a callback
    this.btn.onShortPress(this.shortPressEvent.bind(this));
    this.btn.onLongPress(this.longPressEvent.bind(this));

    this.client.onReceive(this.onReceiveEvent.bind(this));
  }

  /**
   * A function to call when message is received from server.
   * @param {object} data - A JSON sent from the server; data.event_id contains the message.
   */
  onReceiveEvent(data) {
    if (data.event_id === 'LOCKSAFE') {
      this.led.on();
    } else if (data.event_id === 'ALARM') {
      this.buzzer.on();
      let duration = parseInt(data.alarmDuration) * 1000;
      setTimeout(() => {
        this.buzzer.off()
      }, duration);
    }
  }

  /** A function to call when button is short pressed. */
  shortPressEvent() {
    if (this.currentState === state.WAITING) {
      this.currentState = state.RUNNING;
      // Blink the led when the program is running
      this.blinkTimer = this.led.blink(500);
      // Switch into DONE state after 5 seconds
      this.msgTimeout = setTimeout(this.sendIncident.bind(this), 5000);
    } else if (this.currentState === state.RUNNING) {
      this.accumulator += '.';
    }
  }

  /** A function to call when button is long pressed. */
  longPressEvent() {
    if (this.currentState === state.WAITING) {
      // Stop the alarm and unlock the safe
      this.led.off();
      this.buzzer.off();
    } else if (this.currentState === state.RUNNING) {
      // Check if there is a '--' which signifies the cancellation of message
      if (this.accumulator[this.accumulator.length - 1] === '-') {
        console.log('Cancel message input');
        this.currentState = state.WAITING;
        this.accumulator = '';
        clearTimeout(this.msgTimeout);
      } else {
        this.accumulator += '-';
      }
    }
  }

  /** A timeout event after the program enters RUNNING mode. */
  sendIncident() {
    this.currentState = state.WAITING;
    // Stop the blinking after message is sent
    clearInterval(this.blinkTimer);
    this.led.off();

    // The message starts from second press, the first press is severity
    let message = combination[this.accumulator.slice(1)];
    let severity = this.accumulator[0];
    if (message !== undefined) {
      // Send the accumulator
      let data = {
        event_type: 'Ground',
        locationAddr: "Monash University, Bandar Sunway, 47100, Malaysia"
      };

      // The first press determines the severity
      // '.' is a severe incident
      // '-' is a minor incident
      if (severity === '.') {
        data.severity = 'Severe';
      } else if (severity === '-') {
        data.severity = 'Minor';
      }

      // Send the message represented by each combination
      data.event_id = message;

      // 2 methods to calculate the latency
      // Date.now() depends on the time delay in BB
      // World Time API might cost more in calling the API

      /* ============================================================== */
      data.sent = Date.now();
      this.client.broadcast(data);
      /* ============================================================== */
      // this.client.broadcast(data) 
      // has to be called as a callback for request() because it is async
      // let apiUrl = 'http://worldtimeapi.org/api/timezone/Asia/Kuala_Lumpur';
      // request(apiUrl, ((err, response, body) => {
      //   data.sent = Date.parse(JSON.parse(body).datetime);
      //   this.client.broadcast(data);
      // }).bind(this));
      /* ============================================================== */

      console.log(JSON.stringify(data));
    }

    // Clean up the accumulator after the message is sent
    this.accumulator = '';
  }
}

main = new Main()
main.run()