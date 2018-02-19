var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, { pingTimeout: 30000 });

var connectedUsers = 0;
var users = {}

io.on('connection', (socket) => {
	console.log('A User Connected');  
	connectedUsers++;
	users[socket.id] = socket

	socket.on('disconnect', (reason) => {
		console.log('A User Disconnected');
		connectedUsers--;
	})

	// Raft Socket

	// Voting
	socket.on('RequestVote', (candidateId, index) => {
		io.emit('DoVote', candidateId, index);
	});
	socket.on('VoteForCandidate', (candidateId, result) => {
		users[candidateId].emit('VoteResult', result, connectedUsers);
	});

	socket.on('Elected', (chain) => {
		io.emit('NewLeaderElected', chain);

	});

	// Heartbeat
	socket.on('SendHeartbeat', () => {
		io.emit('HeartbeatListener');
	});




});






server.listen(3000, () => { console.log('Listening On Port 3000'); });