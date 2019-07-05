var b = require('bonescript');

/** Class representing an LED connected to a Beaglebone. */
class Led {
  /**
   * Create an LED object; Initializes given GPIO pin number as output.
   * @param {string} channel - GPIO pin number of LED.
   */
  constructor(channel) {
    this.channel = channel;
    b.pinMode(this.channel, b.OUTPUT);
  }

  /**
   * Return power state of LED.
   * Note: Immediately querying after LED object initialization will give
   *       an inaccurate state. A slight delay after init is required for
   *       accurate query.
   */
  get state() {
    return b.digitalRead(this.channel);
  }

  /** Turn LED on. */
  on() {
    b.digitalWrite(this.channel, b.HIGH);
  }

  /** Turn LED off. */
  off() {
    b.digitalWrite(this.channel, b.LOW);
  }

  /** Toggle power state of LED. */
  toggle() {
    b.digitalWrite(this.channel, !this.state);
  }

  /**
   * Blink LED at a given interval for a given duration.
   * @param {int} interval - Time interval between on and off.
   * @param {int} duration - Length of time for blinking. Unlimited (-1) by default.
   * @returns {number} - ID value of the timer. Used to cancel the timer.
   */
  blink(interval, duration = -1) {
    if (duration) {
      setTimeout(clearInterval, duration);
    }
    // Fat arrow function call used here cause JavaScript is retarded about
    // remembering 'this' contexts.
    return setInterval(() => this.toggle(), interval);
  }
}

module.exports = Led;
