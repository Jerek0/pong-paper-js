// CONFIG
var jsonConfig = require('./config.json'),
	url = jsonConfig.url, 
	port = jsonConfig.port;

// LOADING DEPENDENCIES
var http = require('http');
var server = http.createServer();
var io = require('socket.io')(server);

// AND LAUNCHING SERVER
server.listen(port, url, function() {
	console.log('Server launched on '+url+':'+port);
});


// CLASSES & CONNECTION

var Connection = {

	init: function() {
		var self = this;

		this.gameControllers = [];

		// Check for connection
		io.sockets.on('connection', function(socket) {
			console.log('Connection attempt');

			socket.on('newHosting', function() {
				self.newHost(socket);
			});
			socket.on('joinHosting', function(data) {
				self.newJoin(socket, data)
			});

			socket.on('disconnect', function() {
				console.log('Disconnected');
			});
		});
	},

	newHost: function(socket) {
		console.log('Host attempt');
		socket.gameID = Math.round((Math.random() * 1000));
		//socket.gameID = 100;

		// Get the room
		socket.room = io.sockets.adapter.rooms[socket.gameID];

		// Checks if the room already exists
		if(socket.room==undefined) {
			console.log("Room created with ID "+socket.gameID);

			// Inform client of the room ID and Join this room
			socket.emit('newGameID', {gameID: socket.gameID});
			socket.join(socket.gameID);

			// New instance of game
			this.gameControllers[socket.gameID] = new GameController();
			this.gameControllers[socket.gameID].init(socket.gameID);
			this.gameControllers[socket.gameID].setComputer(socket);

		} else { // If so, try another one
			console.log("Room "+socket.gameID+" already set, trying another one");
			this.newHost(socket);
		}

	}, 

	newJoin: function(socket, data) {
		console.log('Join attempt on game '+data.gameID);

		socket.gameID = data.gameID;
		// Get the room
		socket.room = io.sockets.adapter.rooms[socket.gameID];

		// Check if the room exists
		if(socket.room!=undefined) {
			socket.join(socket.gameID);
			this.gameControllers[socket.gameID].setMobile(socket);
		} else {
			alert('Personne dans la room');
		}
	}
}

// Une instance par paire desktop / mobile
function GameController() {
	this.init = function(gameID) {
		this.gameID = gameID;
	},

	this.setComputer = function(socket) {
		this.computer = socket;
	},

	this.setMobile = function(socket) {
		var self = this;

		this.mobile = socket;

		// Inform everyone in the room that there is a new connection between them
		io.sockets.in(this.gameID).emit('newBridge');

		this.mobile.on('mobileMove', function() {
			self.computer.emit('move');
		});

		this.mobile.on('mobileDelta', function(data) {
			self.computer.emit('delta', data);
		});

		this.mobile.on('mobileStop', function() {
			self.computer.emit('stop');
		});
	}
}

Connection.init();