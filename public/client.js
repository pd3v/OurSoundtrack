
//const PORT = process.env.PORT || 8080
const HOST = location.origin.replace(/^https/, 'wss')

var feedbackDelayObj = new Tone.PingPongDelay({
  "delayTime" : "0.1",
  "feedback" : 0.25,
  "wet" : 0.25
}).toMaster();

var player = new Tone.Player("egtr.wav").connect(feedbackDelayObj);

player.autostart = true;
player.loop = true;

//var socket = new WebSocket('ws://localhost:8081/');
var socket = new WebSocket(HOST);
//var socket = new WebSocket("wss://" + server);

console.log(HOST);

socket.onopen = function(event) {
  //log('Opened connection 🎉');
  var json = JSON.stringify({ message: 'Hello' });
  socket.send(json);
  //log('Sent: ' + json);
}

socket.onerror = function(event) {
  //log('Error: ' + JSON.stringify(event));
}

socket.onmessage = function (event) {
  //log('Received: ' + event.data);
  modulation(event.data);
}

socket.onclose = function(event) {
  //log('Closed connection 😱');
}

document.querySelector('#close').addEventListener('click', function(event) {
  socket.close();
  //log('Closed connection 😱');
});

document.querySelector('#send').addEventListener('click', function(event) {
  //var json = JSON.stringify({ message: 'Hey there' });
  var json = JSON.stringify({ message: cont++ });
  socket.send(json);
  //log('Sent: ' + json);
});

var log = function(text) {
  var li = document.createElement('li');
  li.innerHTML = text;
  document.getElementById('log').appendChild(li);
}

var modulation = function(text){
    var modulateServerStream = JSON.parse(text);
    feedbackDelayObj.feedback.value = modulateServerStream.message;
    
    document.getElementById('modulation').innerHTML = modulateServerStream.message;
    document.getElementById('numClients').innerHTML = modulateServerStream.numClients;
    
    console.log(text);
}

window.addEventListener('beforeunload', function() {
  socket.close();
});
