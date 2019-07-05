const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const request = require('request');
const LISTENPORT = 4444;

// Serving
app.use(express.static(__dirname + '/client'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


// Socket IO event listener
io.on('connection', function (socket) {
  socket.on('broadcast', function (msg) {
    socket.broadcast.emit('broadcast', msg);
    console.log(`BROADCAST: ${JSON.stringify(msg)}.`);
  });
  socket.on('BB connect', () => {
    socket.broadcast.emit('BB connect');
    console.log('Beaglebone Black connected.')
  });
});

// Start HTTP listener
http.listen(LISTENPORT, () => {
  console.log(`Listening on *:${LISTENPORT}.`);
});