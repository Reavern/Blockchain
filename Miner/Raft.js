const IP_ADDRESS = 'http://localhost:3000'
const socket = require('socket.io-client')(IP_ADDRESS);

var voted = false;
var leader = false;
var voteResult = [];
var timer;

socket.on('connect', function(){ console.log("Connected") });
socket.on('disconnect', function(){ console.log("Disconnected") });

socket.on('kpu-propose-leader-listener', (id) => {

	if (socket.id === id) {
		voteResult.push(true)
	} else {
		socket.emit('kpu-propose-leader-feedback', id, !voted)
		voted = true;
	}

});

socket.on('kpu-propose-leader-result', (result) => {
	voteResult.push(result)

	clearTimeout(timer);
	timer = setTimeout(()=> {
		var trueCount = 0;
		var falseCount = 0;
		for (var x = 0; x < voteResult.length; x++) {
			if (voteResult[x]) {
				trueCount++;
			} else {
				falseCount++;
			}
		}
		console.log(trueCount)
		console.log(falseCount)
		console.log(voteResult)
	}, 3000)
	
})

setTimeout(() => {
	socket.emit('kpu-propose-leader', socket.id)
}, 3000)

