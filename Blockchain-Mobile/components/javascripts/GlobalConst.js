global.keystore = "@FarellBlock:keystore_test"
global.loggedIn = "@FarellBlock:loggedIn_test"
global.blockchain = "@FarellBlock:1000110_TEST"
global.IP_ADDRESS = "http://192.168.1.252:3000"

var start = end = delay = 0

getTimestamp = () => {
	const currentTimestamp = new Date().getTime()
	return currentTimestamp
}

global.startTimestamp = () => {
	start = getTimestamp()
}

global.stopTimestamp = () => {
	end = getTimestamp()
	delay = end - start

	console.log(start + "-" + end + "-" + delay)
}