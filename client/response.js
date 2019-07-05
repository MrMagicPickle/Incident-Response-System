"use strict";

let blinkState = 0
let alertInterval = undefined;
let reportedData;
let audio = new Audio('/audio.mp3');
let msgWindowDefaultBackground = document.getElementById('message').style.backgroundColor;

// Socket.io listeners
let socket = io();

socket.on('BB connect', () => {
  let connectionStatusRef = document.getElementById('connectionStatus');
  connectionStatusRef.style.color = 'green';
  $('#connectionStatus p').replaceWith(`<p>Connected: ${Date()}</p>`);
})

socket.on('broadcast', (data) => {
  console.log(`response.js broadcast listener - ${data}`);
  data.received = Date.now();
  reportedData = data;

  if (data.event_type === 'Response') {
    $('#responseTeamMsg').text(`${data.event_type}: ${data.event_id}, ${data.received - data.sent}ms`);
  } else if (data.event_type === 'Ground') {
    $('#groundStaffMsg').text(`${data.event_type}: ${data.event_id}, ${data.received - data.sent}ms`);
  }

  if (data.severity === 'Severe') {
    alertInterval = setInterval(blinkPage, 1000);
  }
});


/**
 * Emit an event from the response team.
 * @param {object} element - Button id.
 */
function responseTeamEvent(element) {
  let event = {
    event_type: 'Response',
    event_id: String(element.id).toUpperCase(),
    sent: Date.now(),
  };
  $('.response').text(`${event.event_type}: ${event.event_id}`);
  socket.emit('broadcast', event);
  stopBlink();
};

/** Blink the message window. */
function blinkPage() {
  let msgWindowRef = document.getElementById('message');
  audio.play()
  if (blinkState) {
    msgWindowRef.style.backgroundColor = 'red';
    blinkState = !blinkState;
  } else {
    msgWindowRef.style.backgroundColor = msgWindowDefaultBackground;
    blinkState = !blinkState;
  }
}

/** Stop message window blinking. */
function stopBlink() {
  audio.pause()
  let msgWindowRef = document.getElementById('message');
  msgWindowRef.style.backgroundColor = msgWindowDefaultBackground;
  clearInterval(alertInterval);
}

/** Report an incident to the police. */
function alertPolice() {
  let event = {
    event_type: 'Response',
    event_id: 'POLICE',
    locationAddr: reportedData.locationAddr,
    sent: Date.now(),
  }
  $('.response').text(`${event.event_type}: ${event.event_id}`);
  socket.emit('broadcast', event);
  stopBlink();
}

/** Sound the alarm at the bank. */
function soundAlarm() {
  let durationBox = document.getElementById('duration');
  let duration = durationBox.options[durationBox.selectedIndex].value;
  console.log(duration, typeof (duration));
  let event = {
    event_type: 'Response',
    event_id: 'ALARM',
    alarmDuration: duration,
    sent: Date.now(),
  }
  socket.emit('broadcast', event);
  offOverlay();
  stopBlink();
  $('.response').text(`${event.event_type}: ${event.event_id} for ${duration} seconds`);
}

function setAlarmDuration() {
  onOverlay();
}

/** Display alarm duration overlay. */
function onOverlay() {
  document.getElementById('overlay').style.display = 'block';
}

/** Hide alarm duration overlay. */
function offOverlay() {
  document.getElementById('overlay').style.display = 'none';
}