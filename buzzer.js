var b = require('bonescript');

/** Class representing a buzzer connected to a Beaglebone. */
class Buzzer {
  /**
   * Create a Buzzer object; Initializes given GPIO pin number as output.
   * @param {string} channel - GPIO pin number of buzzer.
   */
  constructor(channel) {
    this.channel = channel;
    b.pinMode(this.channel, b.OUTPUT);
  }

  get state() {
    return b.digitalRead(this.channel);
  }

  /** Turn buzzer on. */
  on() {
    b.digitalWrite(this.channel, b.HIGH);
  }

  /** Turn buzzer off. */
  off() {
    b.digitalWrite(this.channel, b.LOW);
  }
}

module.exports = Buzzer;