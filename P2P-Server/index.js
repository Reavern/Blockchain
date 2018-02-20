var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, { pingTimeout: 30000 });

var connectedUsers = 0;
var users = {}
var leader = "";

io.on('connection', (socket) => {
	console.log('A User Connected');  
	connectedUsers++;
	users[socket.id] = socket

	socket.on('disconnect', (reason) => {
		console.log('A User Disconnected');
		connectedUsers--;
	})

	// Raft Socket

	// Leader Election
	socket.on('RequestVote', (candidateId, index) => {
		io.emit('DoVote', candidateId, index);
	});
	socket.on('VoteForCandidate', (candidateId, result) => {
		users[candidateId].emit('VoteResult', result, connectedUsers);
	});

	socket.on('Elected', (leaderId) => {
		leader = leaderId;
		io.emit('NewLeaderElected');
	});


	// Sync
	socket.on('RequestSync', (userId) => {
		users[leader].emit('SyncRequest', userId)
	})
	socket.on('SendSync', (chain, userId) => {
		users[userId].emit('SyncListener', chain)
	})

	// Heartbeat
	socket.on('SendHeartbeat', () => {
		io.emit('HeartbeatListener');
	});




});






server.listen(3000, () => { console.log('Listening On Port 3000'); });