var b = require('bonescript');

/** Class representing a button connected to a Beaglebone. */
class Button {
  /**
   * Create a Button object; Initialize given GPIO pin number as input.
   * Attach interrupt to the Button object to detect short or long press.
   * @param {string} channel - GPIO pin number of Button.
   */
  constructor(channel) {
    this.channel = channel;
    b.pinMode(this.channel, b.INPUT);

    this.longPressEvent = null;
    this.shortPressEvent = null;

    var self = this;
    b.attachInterrupt(self.channel, true, b.RISING, (err, x) => {
      if (x.value === 1) {
        let timeout = setTimeout(() => {
          // Identified as long press after timeout (500 ms).
          clearInterval(interval);
          if (self.longPressEvent !== null) {
            self.longPressEvent();
          }
        }, 500);

        // Keep polling before timeout (every 100 ms).
        let interval = setInterval(() => {
          if (b.digitalRead(self.channel) === b.LOW) {
            // Identified as short press if button is released before timeout.
            clearTimeout(timeout);
            if (self.shortPressEvent !== null) {
              self.shortPressEvent();
            }
            clearInterval(interval);
          }
        }, 100);
      }
    });
  }

  /**
   * Attach a callback event when short pressed.
   * @param {function} shortPressEvent - Function to be called when we short press the button.
   */
  onShortPress(shortPressEvent) {
    this.shortPressEvent = shortPressEvent;
  }

  /**
   * Attach a callback event when long pressed
   * @param {function} longPressEvent - Function to be called when we long press the button.
   */
  onLongPress(longPressEvent) {
    this.longPressEvent = longPressEvent;
  }
}

module.exports = Button;

