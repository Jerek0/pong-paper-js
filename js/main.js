var cpt;

// ############################# //
// ####### CLASSE GAME ######### //
// ############################# //

var Game = function() {
	this.players = [];
	this.ui = new PointText(new Point(window.innerWidth/2-20,20));
	this.ui.fillColor = "black";
};

Game.prototype.init = function() {
	this.bouboule = new Pallet();
	this.players[0] = new Player(new Point(50, 100), ['a','q']);
	this.players[1] = new Player(new Point(window.innerWidth-100, 100), ['p','l']);
	this.updateScores();
};

Game.prototype.updateScores = function() {
	this.ui.content = this.players[0].score+' - '+this.players[1].score;
}

Game.prototype.checkCollisions = function() {
	for(cpt=0; cpt<this.players.length; cpt++) {
		var collisions = this.bouboule.view.getIntersections(this.players[cpt].view);

		if(collisions.length) {
			// On empeche la bouboule d'entrer dans une boucle de collision avec un boolean
			if(this.players[cpt].colliding == false) {
				this.bouboule.vitesse.x = -this.bouboule.vitesse.x;	

				this.bouboule.vitesse.y += (this.players[cpt].vel.y)/4;
				this.players[cpt].colliding = true;
			} 
		} else {
			// Si il n'y a plus aucune collision, on désactive le boolean
			this.players[cpt].colliding = false;
		}
	}
};

Game.prototype.controlsManager = function() {
	for(cpt=0;cpt<this.players.length; cpt++) {
		if(this.players[cpt].keyStatus[0]) this.players[cpt].move(-this.players[cpt].acceleration);
		if(this.players[cpt].keyStatus[1]) this.players[cpt].move(+this.players[cpt].acceleration);
	}
}

// ############################# //
// ####### CLASSE PLAYER ####### //
// ############################# //

var Player = function(pos, keyMap) {
	var _self = this;
	this.keyMap = keyMap; // 0 -> UP / 1 -> DOWN
	this.keyStatus = [false,false];
	this.score = 0;

	this.acceleration = 2;
	this.vel = { y : 0 };
	this.friction = 1 - 0.1;

	this.colliding = false;

	this.view = new Path.Rectangle({
		point : pos, 
		size : new Size(20,80),
		strokeColor : 'black'
	});
};

Player.prototype.move = function(delta) {
	this.vel.y += delta;
}

Player.prototype.physics = function() {
	this.vel.y *= this.friction;
	this.view.position.y = this.view.position.y + this.vel.y;
}

// ############################# //
// ####### CLASSE PALET ######## //
// ############################# //

var Pallet = function() {
	this.reset();
}

Pallet.prototype.reset = function() {
	if(this.view != null) this.view.remove();
	this.view = new Path.Circle({
		center: view.center,
		radius: 20,
		strokeColor: 'black'
	});
	this.vitesse = {x: 0, y: 0};
}

Pallet.prototype.launch = function() {
	if(this.vitesse.x == 0 && this.vitesse.y == 0)
		this.vitesse = {x: 6*(Math.round(Math.random())*2-1), y : 0};
}

Pallet.prototype.move = function() {
	this.view.position.y += this.vitesse.y;
	this.view.position.x += this.vitesse.x;
}

Pallet.prototype.checkFrameCollisions = function() {
	if(this.view.position.y >= window.innerHeight || this.view.position.y <= 0) {
		this.vitesse.y = -this.vitesse.y;
	}
}

Pallet.prototype.checkWins = function(players) {
	if(this.view.position.x >= window.innerWidth || this.view.position.x <= 0) {
		if(this.view.position.x > window.innerWidth) players[0].score++;
		if(this.view.position.x < 0) players[1].score++;

		return true;
	}
}

// =================================================================================== //

// ###################### //
// ####### INIT ######### //
// ###################### //

var game = new Game();
game.init();

// ############################# //
// ####### MAIN LOOP ########### //
// ############################# //

function onFrame(event) {
	game.controlsManager();
	game.bouboule.move();
	game.checkCollisions();
	game.bouboule.checkFrameCollisions();
	
	if(game.bouboule.checkWins(game.players)) {
		game.bouboule.reset();
		game.updateScores();	
	} 

	for (cpt = 0; cpt < game.players.length; cpt++)
		game.players[cpt].physics();
}

// ############################# //
// ####### KEY LISTENERS ####### //
// ############################# //

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

		// LAUNCH BUTTON
		case 'space':
		game.bouboule.launch();
		break;
	}
	console.log(event.key);
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