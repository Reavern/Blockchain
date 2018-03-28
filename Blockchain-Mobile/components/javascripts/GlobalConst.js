global.keystore = "@FarellBlock:keystore_test"
global.loggedIn = "@FarellBlock:loggedIn_test"
global.blockchain = "@FarellBlock:00012_TEST"
global.IP_ADDRESS = "http://192.168.1.252:3000"

global.getTimestamp = () => {
	const currentTimestamp = new Date().getTime()
	return currentTimestamp
}