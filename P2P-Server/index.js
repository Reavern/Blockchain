var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, { pingTimeout: 3000 });

var connectedUsers = 0;
var users = {};
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
		if(users[candidateId] != undefined) {
			users[candidateId].emit('LeaderVoteResult', result, connectedUsers);
		}
	});

	socket.on('Elected', (leaderId) => {
		leader = leaderId;
		io.emit('NewLeaderElected');
	});

	// Sync
	socket.on('RequestSync', (userId) => {
		console.log(userId + " Requested Sync")
		if(users[leader] != undefined) {
			users[leader].emit('SyncRequest', userId)
		}
	})
	socket.on('SendSync', (chain, pool, userId) => {
		if(users[userId] != undefined) {
			users[userId].emit('SyncListener', chain, pool)
		}
	})

	// Append
	socket.on('AddDataToPool', (nextBlock, type) => {
		io.emit('DataToPool', nextBlock, type);
	})
	socket.on('ProcessPool', (block, type) => {
		io.emit('DataToVote', block, type);
	})
	socket.on('VoteForData', (result) => {
		if(users[leader] != undefined) {
			users[leader].emit('DataVoteResult', result, connectedUsers)
		}
	})
	socket.on('CommitData', (pool, type) => {
		io.emit('DataToCommit', pool, type);
	})
	socket.on('RemoveData', () => {
		io.emit('DataToRemove');
	})

	// Heartbeat
	socket.on('SendHeartbeat', () => {
		io.emit('HeartbeatListener');
	});




});






server.listen(3000, () => { console.log('Listening On Port 3000'); });