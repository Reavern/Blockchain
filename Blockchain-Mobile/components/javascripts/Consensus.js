import { AsyncStorage } from 'react-native';

const socket = require('socket.io-client')(global.IP_ADDRESS);
const Blockchain = require('./Blockchain.js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

global.isConnected = false;
var blockchain = new Blockchain()

// Helper Function
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
var currentPoolData = "";
var currentPoolType = "";

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
	socket.emit('RequestVote', socket.id, blockchain.getTransactionsLength())
	leaderTimeout = randomTimeout();
	resetLeaderTimeout();
}
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
		console.log("Users: " + connectedUsers)
	console.log("True: " + trueCount)
	}
});

socket.on('DoVote', (candidateId, index) => {
	if ((index >= blockchain.getTransactionsLength() && votedFor == "") || votedFor == candidateId) {
		socket.emit('VoteForCandidate', candidateId, true)
		votedFor = candidateId
	} else if (candidateId == socket.id) {
		socket.emit('VoteForCandidate', candidateId, true)
		votedFor = candidateId
	} else {
		socket.emit('VoteForCandidate', candidateId, false)
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
	const newBlockchain = JSON.parse(chain)
	blockPool = JSON.parse(pool);

	blockchain.main.transactions.replaceChain(newBlockchain.transactions)
	blockchain.main.contracts.replaceChain(newBlockchain.contracts)

	const storeData = JSON.stringify(blockchain.main)
	AsyncStorage.setItem(global.blockchain, storeData, () => {
		isFirstTimeSynced = true
		clearTimeout(setTimeoutFirstTime)
		console.log("Blockchain Synced!")	
	})


})
// Leader Send Sync
socket.on('SyncRequest', (userId) => {
	const syncData = JSON.stringify(blockchain.main)
	socket.emit('SendSync', syncData, JSON.stringify(blockPool), userId)
	console.log("Sync Sent To: " + userId)
})

// Hearbeat
function resetLeaderTimeout() {
	voteResult = []
	votedFor = ""
	clearTimeout(setTimeoutLeader)
	setTimeoutLeader = setTimeout(() => {
		console.log("Leader Election By: " + socket.id)
		requestVote()
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
		isPooling = true
		currentPoolData = JSON.parse(blockPool[0].block)
		currentPoolType = blockPool[0].type

		if (currentPoolType == "CONTRACTS") {
			currentPoolData.index = blockchain.getContractsLength()
			currentPoolData.prevHash = blockchain.getLatestContractsHash()
		} else if (currentPoolType == "TRANSACTIONS") {
			currentPoolData.index = blockchain.getTransactionsLength()
			currentPoolData.prevHash = blockchain.getLatestTransactionsHash()
		}
		currentPoolData = JSON.stringify(currentPoolData)

		socket.emit('ProcessPool', currentPoolData, currentPoolType)
	}
}


socket.on('DataToVote', (block, type) => { // All
	isPooling = true;
	const newBlock = JSON.parse(block)
	const keyValid = verifyMessage(newBlock.hash, newBlock.sign, newBlock.sender)
	var latestBlock, blockValid, contractValid,transactionValid
	var contractOverallValid, transactionOverallValid

	AsyncStorage.getItem(global.blockchain, (err, res) => {
		if (!err && res) {
			const contractData = JSON.parse(res).contracts.chain
			const transactionList = JSON.parse(res).transactions.chain

			for (var x = 0; x < contractData.length; x++) {
				if (contractData[x].data.voteId == newBlock.data.voteId) {
					contractValid = true
					for (var y = 0; y < transactionList.length; y++) {
						if (transactionList[y].data.voteId == newBlock.data.voteId) {
							if (transactionList[y].sender == newBlock.sender) {
								transactionValid = true
							} else {
								transactionValid = false
							}
						} 
					}
					break
				} else {
					contractValid = false
				}
			}
			if (type == "TRANSACTIONS") {
				contractOverallValid = contractValid
				transactionOverallValid = !transactionValid
				latestBlock = blockchain.main.transactions.getLatestBlock()
				blockValid = blockchain.main.transactions.isNewBlockValid(newBlock)
			} else if (type == "CONTRACTS") {
				contractOverallValid = !contractValid
				transactionOverallValid = true
				latestBlock = blockchain.main.contracts.getLatestBlock()
				blockValid = blockchain.main.contracts.isNewBlockValid(newBlock)
			}
			var result = false;
			if (keyValid && blockValid && contractOverallValid && transactionOverallValid) {
				result = true;
			}
			socket.emit('VoteForData', result);
		} else {
			socket.emit('VoteForData', false);
		}
	})

});

socket.on('DataVoteResult', (result, connectedUsers) => { // Leader
	dataVoteResult.push(result);
	clearTimeout(setTimeoutProcess);
	setTimeoutProcess = setTimeout(() => {
		if (checkResult(connectedUsers, dataVoteResult)) {
			socket.emit('CommitData', currentPoolData, currentPoolType)
		} else {
			socket.emit('RemoveData');
		}
		dataVoteResult = []
	}, 100)
});

socket.on('DataToRemove', () => { // All
	blockPool.splice(0, 1);
	isPooling = false;
	console.log("DISCARD")
})

socket.on('DataToCommit', (pool, type) => { // All
	const newBlock = JSON.parse(pool)
	if (type == "TRANSACTIONS") {
		blockchain.main.transactions.addNewBlock(newBlock)
	} else if (type == "CONTRACTS") {
		blockchain.main.contracts.addNewBlock(newBlock)
	} else {
		console.log("No Type")
	}
	const storeData = JSON.stringify(blockchain.main)
	AsyncStorage.setItem(global.blockchain, storeData, () => {
		blockPool.splice(0, 1);
		isPooling = false;
		console.log("COMMITED")
	})

});

socket.on('DataToPool', (block, type) => {
	blockPool.push({block: block, type: type});
})

// First Time Run
function firstTimeRun() {
	resetLeaderTimeout()
	resetPoolTimeout()
	AsyncStorage.getItem(global.blockchain, (err, res) => {

		if (!err && res) {
			const storedBlockchain = JSON.parse(res)
			blockchain.main.transactions.replaceChain(storedBlockchain.transactions)
			blockchain.main.contracts.replaceChain(storedBlockchain.contracts)

		}

		setTimeoutFirstTime = setInterval(() => {
			if (hasLeader && !isFirstTimeSynced) {
				socket.emit('RequestSync', socket.id)
			}
		}, 500);
	})
}


// Global Function
global.addNewTransaction = function(nextData, key) {
	const nextBlock = blockchain.main.transactions.generateNewBlock(nextData, key)
	const nextBlockString = JSON.stringify(nextBlock)
	socket.emit('AddDataToPool', nextBlockString, "TRANSACTIONS")
}

global.addNewContract = function(nextData, key) {
	const nextBlock = blockchain.main.contracts.generateNewBlock(nextData, key)
	const nextBlockString = JSON.stringify(nextBlock)
	socket.emit('AddDataToPool', nextBlockString, "CONTRACTS")
}