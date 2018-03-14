import { AsyncStorage } from 'react-native';

const IP_ADDRESS = 'http://192.168.1.252:3000'
const socket = require('socket.io-client')(IP_ADDRESS);
const BC = require('./Blockchain.js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

global.isConnected = false;
global.privKey = ""; 
global.pubKey = "";
global.blockchain = new BC.Blockchain()
global.blockchain.setGenesisBlock()

const blockId = "@FarellBlock:0000-test"
AsyncStorage.getItem(blockId, (err, res) => {
			if (!err && res) {
				var newData = JSON.parse(res)
				global.blockchain.replaceChain(newData)
			} else {
				console.log("Empty")
			}
			setInterval(()=> {
				var storeData = JSON.stringify(global.blockchain)
				AsyncStorage.setItem(blockId, storeData)
			}, 1000)
		})



// Helper Function
function getBlockchainIndex() {
	return global.blockchain.chain.length;
}

function verifyMessage(msg, sign, key) {
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
var isPooling = false;
var votedFor = "";
var blockPool = [];
var currentPool = "";

// First Time State
var hasLeader = false;
var isFirstTimeSynced = false;

var voteResult = [];
var dataVoteResult = []

// Timeouts
var setTimeoutLeader, setTimeoutVote, setTimeoutFirstTime, setTimeoutPool, setTimeoutProcess;
var leaderTimeout = 1000;

socket.on('connect', () => {
	console.log("Connected: " + socket.id);
	global.isConnected = true;
	firstTimeRun();
});
socket.on('disconnect', () => { 
	console.log("Disconnected");
	global.isConnected = false;
	isFirstTimeSynced = false;
	isLeader = false;
});

// Request Vote
function requestVote() {
	voteResult = [];
	socket.emit('RequestVote', socket.id, global.blockchain.chain.length)
	leaderTimeout = randomTimeout();
	resetLeaderTimeout();
}

function checkResult(connectedUsers, resultArray) {
	var halfUsers = Math.floor(connectedUsers / 2);
	var trueCount = 0;
	for (var x = 0; x < resultArray.length; x++) {
		if (resultArray[x]) {
			trueCount++;
		}
	}
	console.log("users: " + halfUsers)
	console.log("true: " + trueCount)
	if (trueCount >= halfUsers) {
		return true;
	} else {
		return false;
	}
}

socket.on('LeaderVoteResult', (result, connectedUsers) => {
	voteResult.push(result);
	if (checkResult(connectedUsers, voteResult)) {
		console.log("I'm Elected");
		socket.emit('Elected', socket.id);
		isLeader = true;
		
	}
});

socket.on('DoVote', (candidateId, index) => {
	if ((index >= global.blockchain.chain.length && votedFor == "") || votedFor == candidateId) {
		socket.emit('VoteForCandidate', candidateId, true);
		votedFor = candidateId;
	} else {
		socket.emit('VoteForCandidate', candidateId, false);
	}
});

socket.on('NewLeaderElected', () => {
	leaderTimeout = 1000;
	socket.emit('RequestSync', socket.id);
	clearTimeout(setTimeoutVote);
	resetLeaderTimeout();
})

// Sync
socket.on('SyncListener', (chain, pool) => {
	const newBlockchain = JSON.parse(chain);
	blockPool = pool;
	global.blockchain.replaceChain(newBlockchain);
	isFirstTimeSynced = true;
	clearTimeout(setTimeoutFirstTime);
	console.log("Blockchain Synced!")
})
// Leader Send Sync
socket.on('SyncRequest', (userId) => {
	const syncData = JSON.stringify(global.blockchain)
	socket.emit('SendSync', syncData, blockPool, userId);
	console.log("Sync Sent To: " + userId);
})

// Hearbeat
function resetLeaderTimeout() {
	voteResult = [];
	votedFor = "";
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
}, 250);

socket.on('HeartbeatListener', () => {
	hasLeader = true;
	resetLeaderTimeout();
})

// Append Entries
function resetPoolTimeout() {
	setTimeoutPool = setInterval(() => {
		if (!isPooling) {
			processPooledData();
		}
	}, 100);
}
function processPooledData() {
	if (isLeader && blockPool.length != 0) {
		isPooling = true;
		currentPool = blockPool[0];
		socket.emit('ProcessPool', blockPool[0]);
	}
}
global.addNewTransaction = function(nextData) {
	const nextSender = global.pubKey;
	const nextTimestamp = new Date().getTime();
	const nextBlock = global.blockchain.generateNextBlock(nextData, nextSender, nextTimestamp);
	const nextBlockString = JSON.stringify(nextBlock);
	socket.emit('AddDataToPool', nextBlockString);
}

socket.on('DataToVote', (block) => { // All
	isPooling = true;
	const newBlock = JSON.parse(block);
	const keyValid = verifyMessage(newBlock.hash, newBlock.sign, newBlock.sender);
	const latestBlock = global.blockchain.getLatestBlock();
	const blockValid = global.blockchain.isBlockValid(latestBlock ,newBlock);
	var result = false;
	if (keyValid && blockValid) {
		result = true;
	}
	socket.emit('VoteForData', result);
});

socket.on('DataVoteResult', (result, connectedUsers) => { // Leader
	dataVoteResult.push(result);
	clearTimeout(setTimeoutProcess);
	setTimeoutProcess = setTimeout(() => {
		if (checkResult(connectedUsers, dataVoteResult)) {
			socket.emit('CommitData', currentPool);
		} else {
			socket.emit('RemoveData');
		}
	}, 1000)
});

socket.on('DataToRemove', () => { // All
	blockPool.splice(0, 1);
	isPooling = false;
})

socket.on('DataToCommit', (block) => { // All
	const newBlock = JSON.parse(block);
	global.blockchain.addNewBlock(newBlock);
	console.log(global.blockchain)
	blockPool.splice(0, 1);
	isPooling = false;
});

socket.on('DataToPool', (block) => {
	blockPool.push(block);
})

// First Time Run
function firstTimeRun() {
	resetLeaderTimeout();
	resetPoolTimeout();
	setTimeoutFirstTime = setInterval(() => {
		if (hasLeader && !isFirstTimeSynced) {
			socket.emit('RequestSync', socket.id);
		}
	}, 500);
}

global.changeChainData = function(newChain) {
	global.blockchain = newChain;
	console.log(global.blockchain)
}