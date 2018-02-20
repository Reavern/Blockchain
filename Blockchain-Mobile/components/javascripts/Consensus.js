const IP_ADDRESS = 'http://192.168.1.10:3000'
const socket = require('socket.io-client')(IP_ADDRESS);
const BC = require('./Blockchain.js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

global.privKey = ""; 
global.pubKey = "";
global.blockchain = new BC.Blockchain()
global.blockchain.setGenesisBlock()

// Helper Function
function getBlockchainIndex() {
	return global.blockchain.chain.length;
}

function decryptMessage(msg, sign, key) {
	var pbKey = ec.keyFromPublic(key, 'hex')
	var signed = JSON.parse(sign);
	var result = pbKey.verify(msg, signed);
	return result;
}

function randomTimeout() {
	const min = 1500;
	const max = 3000;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Persistent State
var isLeader = false;
var votedFor = "";

// Candidate State
var voteResult = [];

// Timeouts
var setTimeoutLeader, setTimeoutVote;
var leaderTimeout = 1000;

socket.on('connect', () => {
	console.log("Connected: " + socket.id);
	resetLeaderTimeout();
});
socket.on('disconnect', () => { 
	console.log("Disconnected") ;
	isLeader = false;
});

// Request Vote
function requestVote() {
	voteResult = [];
	socket.emit('RequestVote', socket.id, global.blockchain.chain.length)
	leaderTimeout = randomTimeout();
}

function checkResult(connectedUsers) {
	var halfUsers = connectedUsers / 2;
	var trueCount = 0;
	var falseCount = 0;
	for (var x = 0; x < voteResult.length; x++) {
		if (voteResult[x]) {
			trueCount++;
		}
	}
	if (trueCount > halfUsers) {
		return true;
	} else {
		return false;
	}
}

socket.on('VoteResult', (result, connectedUsers) => {
	voteResult.push(result);
	if (checkResult(connectedUsers)) {
		socket.emit('Elected', socket.id);
		isLeader = true;
		console.log("I'm Elected");
	}
});

socket.on('DoVote', (candidateId, index) => {
	if ((index >= global.blockchain.chain.length && votedFor == "") || votedFor == candidateId) {
		socket.emit('VoteForCandidate', candidateId, true);
		votedFor = candidateId;
	} else {
		socket.emit('VoteForCandidate', candidateId, false);
	}
	setTimeout(() => { votedFor == ""; }, 1000)	
});

socket.on('NewLeaderElected', (chain) => {
	leaderTimeout = 1000;
	socket.emit('RequestSync', socket.id);
	clearTimeout(setTimeoutVote);
	resetLeaderTimeout();
})

// Sync
socket.on('SyncListener', (chain) => {
	const chainSync = JSON.parse(chain)
	global.blockchain = chainSync;
	console.log("Blockchain Synced!")
})
socket.on('SyncRequest', (userId) => {
	const syncData = JSON.stringify(global.blockchain)
	socket.emit('SendSync', syncData, userId);
	console.log("Sync Sent To: " + userId);
})

// Hearbeat
function resetLeaderTimeout() {
	voteResult = [];
	clearTimeout(setTimeoutLeader);
	setTimeoutLeader = setTimeout(() => {
		console.log("Leader Election By: " + socket.id)
		requestVote();
	}, leaderTimeout)	
}

setInterval(() => {
	if (isLeader) {
		socket.emit('SendHeartbeat', socket.id);
	}
}, 250)

socket.on('HeartbeatListener', () => {
	resetLeaderTimeout();
})

// Append Entries
global.addNewTransaction = function(data, senderId) {
	
}


// First Time Run
resetLeaderTimeout();
socket.emit('RequestSync', socket.id);