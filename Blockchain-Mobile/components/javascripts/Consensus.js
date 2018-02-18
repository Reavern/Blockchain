const IP_ADDRESS = 'http://192.168.1.4:3000'

const socket = require('socket.io-client')(IP_ADDRESS);
var isConnected = false;

socket.on('connect', function(){
	console.log("Connected")
	isConnected = true;
});

socket.on('disconnect', function(){
	console.log("Disconnected")
	isConnected = false;
});

socket.on('event', function(data){
	console.log("Event" + data)
});

socket.on('sig', function(data){
	console.log("Sig" + data)
});


global.send_vote = (data) => {
	socket.emit('vote', data);
}

global.sendMessage = (data) => {
	socket.emit('cons', data); 
}