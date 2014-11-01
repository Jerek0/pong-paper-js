var cpt;

// ####### CLASSE GAME
var Game = function() {
	this.players = [];
};

Game.prototype.init = function() {
	this.bouboule = new Pallet();
	this.players[0] = new Player(new Point(50, 100), ['a','q']);
	this.players[1] = new Player(new Point(window.innerWidth-100, 100), ['p','l']);
};

Game.prototype.checkCollisions = function() {
	for(cpt=0; cpt<this.players.length; cpt++) {
		var collisions = this.bouboule.view.getIntersections(this.players[cpt].view);
		if(collisions.length) this.bouboule.vitesse.x = -this.bouboule.vitesse.x;
	}
};

// ####### CLASSE PLAYER
var Player = function(pos, keyMap) {
	var _self = this;
	this.keyMap = keyMap;
	this.keyStatus = [false,false];
	this.inerty = 10;

	console.log(this.keyMap[0]);

	this.view = new Path.Rectangle({
		point : pos, 
		size : new Size(20,80),
		strokeColor : 'black'
	});
};

Player.prototype.move = function(delta) {
	this.view.position.y += delta;
}

// ####### CLASSE PALLET
var Pallet = function() {
	this.vitesse = {x: 6*(Math.round(Math.random())*2-1), y : 6*(Math.round(Math.random())*2-1)};

	this.view = new Path.Circle({
		center: view.center,
		radius: 20,
		strokeColor: 'black'
	});
}

Pallet.prototype.move = function() {
	this.view.position.y += this.vitesse.y;
	this.view.position.x += this.vitesse.x;
}

Pallet.prototype.checkFrameCollisions = function() {
	if(this.view.position.x >= window.innerWidth || this.view.position.x <= 0) {
		this.vitesse.x = -this.vitesse.x;
	}
	if(this.view.position.y >= window.innerHeight || this.view.position.y <= 0) {
		this.vitesse.y = -this.vitesse.y;
	}
	

}

var game = new Game();
game.init();

function onKeyDown(event) {
	switch(event.key) {
		// PLAYER 1 UP
		case game.players[0].keyMap[0]:
		game.players[0].keyStatus[0]=true;
		break;

		// PLAYER 1 DOWN
		case game.players[0].keyMap[1]:
		game.players[0].keyStatus[1]=true;
		break;

		// PLAYER 2 UP
		case game.players[1].keyMap[0]:
		game.players[1].keyStatus[0]=true;
		break;

		// PLAYER 2 DOWN
		case game.players[1].keyMap[1]:
		game.players[1].keyStatus[1]=true;
		break;
	}
}

function onKeyUp(event) {
	switch(event.key) {
		// PLAYER 1 UP
		case game.players[0].keyMap[0]:
		game.players[0].keyStatus[0]=false;
		break;

		// PLAYER 1 DOWN
		case game.players[0].keyMap[1]:
		game.players[0].keyStatus[1]=false;
		break;

		// PLAYER 2 UP
		case game.players[1].keyMap[0]:
		game.players[1].keyStatus[0]=false;
		break;

		// PLAYER 2 DOWN
		case game.players[1].keyMap[1]:
		game.players[1].keyStatus[1]=false;
		break;
	}
}

function onFrame(event) {
	for(cpt=0;cpt<game.players.length; cpt++) {
		if(game.players[cpt].keyStatus[0]) game.players[cpt].move(-game.players[cpt].inerty);
		if(game.players[cpt].keyStatus[1]) game.players[cpt].move(+game.players[cpt].inerty);
	}
	game.checkCollisions();
	game.bouboule.checkFrameCollisions();
	game.bouboule.move();
}