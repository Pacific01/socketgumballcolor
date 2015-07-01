//var app = require('express')();
//var http = require('http').Server(app);
var port = process.env.PORT || 9000
var io = require('socket.io')(port);

/*app.get('/', function(req, res){
	res.sendfile('index.html');
});*/

var otherBunnies = {}

io.on('connection', function(socket){
	for (var key in otherBunnies) {
		socket.emit('update_position', otherBunnies[key])
	}
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	socket.on('update_position', function(info){
		console.log('He recibido update_position')
		info.id = socket.id
		otherBunnies[socket.id] = info
		socket.broadcast.emit('update_position', info)
	});
});

/*http.listen(3000, function(){
	console.log('listening on *:3000');
});*/