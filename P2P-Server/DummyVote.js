const IP_ADDRESS = "http://192.168.1.7:3000"
const socket = require('socket.io-client')(IP_ADDRESS);

var setTimeoutLeader
var isLeader = false
var voteResult = []

socket.on('connect', () => {
	console.log("Connected: " + socket.id);
});
socket.on('disconnect', () => { 
	console.log("Disconnected");
});

socket.on('DoVote', (candidateId, index) => {
    socket.emit('VoteForCandidate', candidateId, true)
});

socket.on('DataToVote', (block, type) => {
	socket.emit('VoteForData', false);
});



socket.on('LeaderVoteResult', (result, connectedUsers) => {
    voteResult.push(result)
	if (checkResult(connectedUsers, voteResult)) {
		console.log("I'm Elected")
		socket.emit('Elected', socket.id)
		isLeader = true
	} else if (connectedUsers == voteResult.length) {
		var trueCount = 0;
		for (var x = 0; x < voteResult.length; x++) {
			if (voteResult[x]) {
				trueCount++;
			}
		}
	}
});

function checkResult(connectedUsers, resultArray) {
	var halfUsers = Math.ceil(connectedUsers / 2);
	var trueCount = 0;
	for (var x = 0; x < resultArray.length; x++) {
		if (resultArray[x]) {
			trueCount++;
		}
	}
	
	if (trueCount >= halfUsers) {
		return true;
	} else {
		return false;
	}
}


function requestVote() {
    socket.emit('RequestVote', socket.id, "100000")
}

function resetLeaderTimeout() {
	clearTimeout(setTimeoutLeader)
	setTimeoutLeader = setTimeout(() => {
		console.log("Leader Election By: " + socket.id)
		requestVote()
	}, 1000)	
}

setInterval(() => {
	if (isLeader) {
		socket.emit('SendHeartbeat', socket.id);
	}
}, 250)

socket.on('HeartbeatListener', () => {
	resetLeaderTimeout()
})

resetLeaderTimeout()