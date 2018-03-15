const Blockchain = require('./Blockchain.js')

var test = new Blockchain()
console.log(test.main.transactions)
var asd = test.main.transactions.generateNewBlock("TEST", "5b6373776ad233c35729747b8342f17c")
test.main.transactions.addNewBlock(asd)
console.log(JSON.stringify(test))
