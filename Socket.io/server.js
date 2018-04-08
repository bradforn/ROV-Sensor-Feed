var SerialPort  = require('serialport2').SerialPort;
var portName = 'COM3';

var io = require('socket.io').listen(8000); // server listens for socket.io communication at port 8000
io.set('log level', 1); // disables debugging. this is optional. you may remove it if desired.

var sp = new SerialPort(); // instantiate the serial port.
sp.open(portName, { // portName is instatiated to be COM3, replace as necessary
   baudRate: 9600,
   dataBits: 8,
   parity: 'none',
   stopBits: 1,
   flowControl: false
});

io.sockets.on('connection', function (socket) {
	// If socket.io receives message from the client browser then
    // this call back will be executed.
    socket.on('message', function (msg) {
    	console.log(msg);
    });
    // If a web browser disconnects from Socket.IO then this callback is called.
    socket.on('disconnect', function () {
    	console.log('disconnected');
    });
});

var cleanData = '';
var readData = '';
sp.on('data', function (data) {
    readData += data.toString();
    // if the letters 'A' and 'B' are found on the buffer then isolate what's in the middle
    // as clean data. Then clear the buffer.
    if (readData.indexOf('B') >= 0 && readData.indexOf('A') >= 0) {
        cleanData = readData.substring(readData.indexOf('A') + 1, readData.indexOf('B'));
        readData = '';
        io.sockets.emit('message', cleanData);
	}
});
