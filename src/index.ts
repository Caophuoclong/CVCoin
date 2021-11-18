import SHA256 from "crypto-js/sha256"
class Transaction{
    from: string | null
    to: string
    amount: number
    constructor(from:string, to:string, amount:number){
        this.from = from
        this.to = to
        this.amount = amount
    }
}
class Block {
    timestamp: number
    data: Transaction[]
    previousHash: string
    hash: string
    nonce: number
    constructor(transaction: Transaction[], previousHash: string){
        this.timestamp = new Date().getTime();
        this.data = transaction;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash(){
        return SHA256(this.nonce + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }

    mine(){
        while(this.hash.substring(0,4) !== "0000"){
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }

}

class BlockChain{
    chain: Block[] = [];
    pendingTransactions: Transaction[] = [];
    miningReward : number;
    constructor(){
        this.chain.push(this.createGenesisBlock());
        this.pendingTransactions = [];
        this.miningReward = 10;
    }
    createGenesisBlock(){
        return new Block(0, "Genesis Block", {null, null, 0});
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    minePendingTransactions(miningRewardAddress: string){
        let block = new Block(this.pendingTransactions, this.getLatestBlock().hash);
        block.mine();
        this.chain.push(block);
        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
    }
    addBlock(newBlock: Block){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        newBlock.mine();
        this.chain.push(newBlock);
    }
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let parseObjectToString = (obj: Object):string =>{
    return JSON.stringify(obj);
}

const cvCoin = new BlockChain();
cvCoin.addBlock(new Block(1,parseObjectToString({amount: 4}), cvCoin.getLatestBlock().hash));
cvCoin.addBlock(new Block(2,parseObjectToString({amount: 10}), cvCoin.getLatestBlock().hash));
console.log(cvCoin);

export default BlockChain;