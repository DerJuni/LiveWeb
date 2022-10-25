// Express is a node module for building HTTP servers
var express = require('express');
var app = express();

// Tell Express to look in the "public" folder for any files first
app.use(express.static('public'));

// If the user just goes to the "route" / then run this function
app.get('/', function (req, res) {
  res.send('Hello World!')
});

// Here is the actual HTTP server 
var http = require('http');
// We pass in the Express object
var httpServer = http.createServer(app);
// Listen on port 90
httpServer.listen(91);

// WebSocket Portion
// WebSockets work with the HTTP server
const { Server } = require('socket.io');
const io = new Server(httpServer, {});

//var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
	
		console.log("We have a new client: " + socket.id);
		
		// When this user emits, client side: socket.emit('otherevent',some data);
		socket.on('chatmessage', function(data) {
			// Data comes in as whatever was sent, including objects
			console.log("Received: 'chatmessage' " + data);
			
			// Send it to all of the clients
			socket.broadcast.emit('chatmessage', data);
		});
//receive the 'mouse'data sent out by the js sketch and sent it out to all of the clients
		socket.on('mouse', function(data) {
			// Data comes in as whatever was sent, including objects
			console.log("Received: 'mouse' " + data);
			
			// Send it to all of the clients
			socket.broadcast.emit('mouse', data);
		});

		socket.on('buttonsDC', function(data) {
			// Data comes in as whatever was sent, including objects
			console.log("Received: 'buttonsDC' " + data);
			
			// Send it to all of the clients
			socket.broadcast.emit('buttonsDC', data);
		});



		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);