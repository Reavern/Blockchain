var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, { pingTimeout: 30000 });

io.on('connection', function(socket){
	console.log('a user connected : ' + socket);  

	socket.on('sending', function(data){      
		io.emit('recieve', data);    

      
		if(data=="exit"){
			socket.disconnect( console.log('sender disconnected'));
		}
	}); 

	socket.on('cons', function(data){      
		console.log(data);
		var json = JSON.stringify(data)
		io.emit('sig', json)
	}); 

});

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

server.listen(3000, function(){
	console.log('listening on *:3000');
});