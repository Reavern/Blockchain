const CryptoJS = require('crypto-js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

//const DIFFICULTY = 4;
export class Block {
	constructor(index, prevHash, timestamp, data, sender) {
		this.index = index;
		this.prevHash = prevHash;
		this.timestamp = timestamp;
		this.data = data;
		this.sender = sender;
		this.hash = this.generateBlockHash();

		if (this.index != 0) {
			this.sign = this.signHash();
		} else {
			this.sign = "Sign";
		}
	}

	generateBlockHash() {
		const toBeHashed = this.index + this.prevHash + this.timestamp + this.data + this.sender;
		const hashedBlock = CryptoJS.SHA256(toBeHashed).toString(CryptoJS.enc.Hex);	
		return hashedBlock;
	}

	signHash() {
		var prKey = ec.keyFromPrivate(global.privKey, 'hex');
		var signedHash = prKey.sign(this.hash).toDER();
		var signedString = "[" + signedHash.toString() + "]";
		return signedString;
	}

}

const GENESIS_INDEX = 0;
const GENESIS_PREV_HASH = "0";
const GENESIS_TIMESTAMP = 0;
const GENESIS_DATA = "Genesis Block";
const GENESIS_SENDER = "Sender";

export class Blockchain {
	constructor() {
		this.chain = [];
	}

	setGenesisBlock() {
		this.chain.push(this.generateGenesisBlock());
	}

	generateGenesisBlock() {
		const genesisBlock = new Block(GENESIS_INDEX, GENESIS_PREV_HASH, GENESIS_TIMESTAMP, GENESIS_DATA, GENESIS_SENDER);
		return genesisBlock;		
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}
	addNewBlock(newBlock) {
		if (this.isBlockValid(this.getLatestBlock(), newBlock)) {
			this.chain.push(newBlock);
		}
	}
	isBlockValid(prevBlock, nextBlock) {
		if (prevBlock.index + 1 !== nextBlock.index) {
			console.log("Invalid Index !");
			return false;
		} else if (prevBlock.hash !== nextBlock.prevHash) {
			console.log("Invalid Previous Hash !");
			return false;
		} else if (nextBlock.generateBlockHash() !== nextBlock.hash) {
			console.log(nextBlock.generateBlockHash())
			console.log(nextBlock.hash)
			console.log("Invalid Hash !");
			return false;
		} else {
			return true;
		}		
	}

	generateNextBlock (nextData, nextSender) {
		const prevBlock = this.getLatestBlock();
		const nextIndex = prevBlock.index + 1;

		const nextTimestamp = new Date().getTime();
		const nextBlock = new Block(nextIndex, prevBlock.hash, nextTimestamp, nextData, nextSender)

		return nextBlock;
	}
}