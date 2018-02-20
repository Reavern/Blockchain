const IP_ADDRESS = 'http://192.168.1.9:3000'
const socket = require('socket.io-client')(IP_ADDRESS);
const BC = require('./Blockchain.js');

global.privKey = ""; 
global.pubKey = "";
global.blockchain = new BC.Blockchain()
global.blockchain.setGenesisBlock()

function getBlockchainIndex() {
	return global.blockchain.chain.length;
}

// Persistent State
var isLeader = false;
var votedFor = "";

// Candidate State
var voteResult = [];

// Volatile State
var commitIndex = 0;
var lastApplied = 0;

// Timeouts
var setTimeoutLeader, setTimeoutVote;

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
	resetVote()	
}

function resetVote() {
	voteResult = [];
	setTimeoutVote = setInterval(() => {
		socket.emit('RequestVote', socket.id, global.blockchain.chain.length);
	}, randomTimeout());
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
		const syncData = JSON.stringify(global.blockchain)
		socket.emit('Elected', syncData);
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
	const chainSync = JSON.parse(chain)
	global.blockchain = chainSync;
	clearTimeout(setTimeoutVote);
	resetLeaderTimeout();
})

// Hearbeat
function resetLeaderTimeout() {
	clearTimeout(setTimeoutLeader);
	setTimeoutLeader = setTimeout(() => {
		console.log("Leader Election By: " + socket.id)
		requestVote();
	}, 1000)	
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


// Helper Functions
function randomTimeout() {
	const min = 1500;
	const max = 3000;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


// First Time Run
