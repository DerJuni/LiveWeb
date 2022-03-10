var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!')
});

var http = require('http');

var httpServer = http.createServer(app);
httpServer.listen(3000);

const { Server } = require('socket.io');
const io = new Server(httpServer, {});

io.sockets.on('connection', newConnection);
	function newconnection (socket) {
	
		console.log("new Connection " + socket.id);
        io.emit('newuser', socket.id);

		socket.on('message', 
			function (data) {
				console.log("message: " + data);
				
			
				io.emit('message', data);
			}
		);

        socket.on('mouse', function(data) {

            data.socketid = socket.id;
            io.emit('mouse', data);
		});
		
		socket.on('otherevent', function(data) {
			console.log("Received: 'otherevent' " + data);

            io.emit('otherevent', data);
		});
		
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected");
		});
	}
);