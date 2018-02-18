const IP_ADDRESS = 'http://localhost:3000'
const socket = require('socket.io-client')(IP_ADDRESS);

var voted = false;
var leader = false;
var voteResult = [];

socket.on('connect', function(){ console.log("Connected") });
socket.on('disconnect', function(){ console.log("Disconnected") });

socket.on('kpu-propose-leader-listener', (id) => {


	if (socket.id === id) {
		voteResult.push(result)
	} else {
		socket.emit('kpu-propose-leader-feedback', id, !voted)
		voted = true;
	}
});

socket.on('kpu-propose-leader-result', (result) => {
	voteResult.push(result)
	console.log(voteResult)

})