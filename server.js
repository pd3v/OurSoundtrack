
var http = require('http');
var express = require('express');
var WSS = require('ws').Server;
const PORT = process.env.PORT || 8080

var app = express().use(express.static('public'));
var server = http.createServer(app);

server.listen(PORT, function(){  
  var fxParam = 0.33;
  var numClients = 0;

  //var wss = new WSS({ port: 8081 });
  var wss = new WSS({server});
  //var wss = new WSS({ port: PORT });
  //console.log(PORT);
  wss.on('connection', function(socket) {
    //console.log('Opened Connection 🎉');

    //var json = JSON.stringify({ message: 'Gotcha' });
    var json = JSON.stringify({ message: fxParam });
    
    socket.send(json);

    socket.on('message', function(message) {
      numClients = wss.clients.length;
      wss.clients.forEach(function each(client) {
        //var json = JSON.stringify({ message: 'Something changed' });
        
        var json = JSON.stringify({ 
          message: fxParam,
          numClients: numClients
        });
        
        client.send(json);
        //console.log('Sent: ' + json);
      });
    });

    socket.on('close', function() {
      //console.log('Closed Connection 😱');
    });
  });

  var broadcast = function() {
    var json = JSON.stringify({
      //message: 'Hello hello!'
      message: Math.random(),
      numClients: numClients
    });
    //console.log("broadcast:",json);
    wss.clients.forEach(function each(client) {
      client.send(json);
      //console.log('Sent: ' + json);
    });
  }
  setInterval(broadcast, Math.random()*5000);
});
