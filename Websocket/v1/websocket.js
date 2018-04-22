var WebSocketServer = require('ws').Server;


var wss = new WebSocketServer({
  port: 4000
});


wss.on('connection', function(ws) {
  ws.on('message', function(Sensor-val){
    console.log('recieved: %s', Sensor-val);
    ws.send(Sensor-val);
  });
});
