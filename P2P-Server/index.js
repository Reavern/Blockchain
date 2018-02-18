var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, { pingTimeout: 30000 });

var kpuClients = {};

io.on('connection', (socket) => {
	console.log('A User Connected');  

	kpuClients[socket.handshake.sessionID] = socket;

	socket.on('cons', (data) => {      
		console.log(data);
		var json = JSON.stringify(data)
		io.emit('sig', json)
	}); 



	// Raft
	socket.on('kpu-propose-leader', (id) => {
		io.emit('kpu-propose-leader-listener', id);
	});

	socket.on('kpu-propose-leader-feedback', (id, result) => {
		socket.to(id).emit('kpu-propose-leader-result', result);
	});


});


server.listen(3000, () => { console.log('Listening On Port 3000'); });