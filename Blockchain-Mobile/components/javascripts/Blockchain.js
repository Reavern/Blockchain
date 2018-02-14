const CryptoJS = require('crypto-js');

const DIFFICULTY = 4;
export class Block {
	constructor(/*index,*/ prevHash, timestamp, data) {
		//this.index = index;
		this.prevHash = prevHash;
		this.timestamp = timestamp;
		this.data = data;
		this.nonce = 0;
		this.hash = this.generate_block_hash();
	}

	generate_block_hash() {
		const toBeHashed = /*this.index*/ + this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce;
		const hashedBlock = CryptoJS.SHA256(toBeHashed).toString(CryptoJS.enc.Hex);	
		return hashedBlock;
	}

	mine_block() {
		while(this.hash.substring(0, DIFFICULTY) !== Array(DIFFICULTY + 1).join("0")) {
			this.nonce++;
			this.hash = this.generate_block_hash();
		}
	}
}

//const GENESIS_INDEX = 0;
const GENESIS_PREV_HASH = "0";
const GENESIS_TIMESTAMP = 0;
const GENESIS_DATA = "Genesis Block";

export class Blockchain {
	constructor() {
		this.chain = [this.generate_genesis_block()];
	}

	generate_genesis_block() {
		const genesisBlock = new Block(/*GENESIS_INDEX,*/ GENESIS_PREV_HASH, GENESIS_TIMESTAMP, GENESIS_DATA);
		genesisBlock.mine_block();
		return genesisBlock;		
	}

	get_latest_block() {
		return this.chain[this.chain.length - 1];
	}
	add_new_block(newBlock) {
		if (this.is_block_valid(this.get_latest_block(), newBlock)) {
			newBlock.mine_block();
			this.chain.push(newBlock);
		}
	}
	is_block_valid(prevBlock, nextBlock) {
		/*if (prevBlock.index + 1 !== nextBlock.index) {
			console.log("Invalid Index !");
			return false;
		} else*/ if (prevBlock.hash !== nextBlock.prevHash) {
			console.log("Invalid Previous Hash !");
			return false;
		} else if (nextBlock.generate_block_hash() !== nextBlock.hash) {
			console.log(nextBlock.generate_block_hash())
			console.log(nextBlock.hash)
			console.log("Invalid Hash !");
			return false;
		} else {
			return true;
		}		
	}
	is_all_block_valid() {
		for (let i = 1; i < this.chain.length; i++) {
			const currBlock = this.chain[i];
			const prevBlock = this.chain[i - 1];

			if (!this.is_block_valid(prevBlock, currBlock)) {
				console.log("Blockchain is invalid !");
				return false;
			}
		}
		console.log("Blockchain is valid !");
		return true;
	}

	replace_chain (newBlock) {
		if (this.is_block_valid(newBlock) && newBlock.length > this.chain.length) {
			console.log("Blockchain is invalid ! Replacing ...");
			this.chain = newBlock;
			// BC ke yang lain
		} else {
			console.log("Received Blockchain Invalid !");
		}
	}

	generate_next_block (nextData) {
		const prevBlock = this.get_latest_block();
		//const nextIndex = prevBlock.index + 1;

		const nextTimestamp = new Date().getTime() / 1000;
		const nextBlock = new Block(/*nextIndex,*/ prevBlock.hash, nextTimestamp, nextData)

		return nextBlock;
	}
}