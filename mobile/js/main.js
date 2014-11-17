function init() {

	// Get the config file to receive the app adress
	$.getJSON("../server/config.json", function(data) {
		var address = data.url+':'+data.port;

		console.log(address);

		$.getScript('http://'+address+"/socket.io/socket.io.js").done(function() {
			mobileController.init(address);
		});
	});
}

var mobileController = {

	$btnTop : $('.button-top'),
	$btnBottom: $('.button-bottom'),

	init: function(address) {
		this.socket = io.connect(address);
		
		this.gameID = this.getQueryVariable('id');

		if(this.gameID !== false) {
			this.sendJoinHosting(this.gameID);
		}
	},

	bindActionsController: function() {
		var self = this;
		var delta = 0;
		var $w = window;

		// BUTTON TOP
		$('body').on('touchstart', function(e) {
			self.socket.emit('mobileMove');
			delta = e.originalEvent.touches[0].clientY;
			delta = calculatePercentage(delta);
			console.log(delta);
		})
		.on('touchmove', function(e) {
			//console.log(e.originalEvent.touches[0].clientY);
			delta = e.originalEvent.touches[0].clientY;
			delta = calculatePercentage(delta);
			self.socket.emit('mobileDelta', { delta: delta});
		})
		.on('touchend', function() {
			self.socket.emit('mobileStop');
		});

		function calculatePercentage(posY) {
			return delta = Math.round((posY - $w.innerHeight/2)*100/($w.innerHeight/2));
		}
	},

	sendJoinHosting: function(id) {
		var data = {
			gameID: id
		}
		var self = this;

		this.socket.emit('joinHosting', data);
		console.log('Joining '+id);

		this.socket.on('newBridge', function() {
			self.bindActionsController();
			self.socket.off('newBridge');
		});

	},

	// Récupère le paramètre "variable" dans l'URL actuelle
	getQueryVariable: function(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split('&');
		for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split('=');
			if(pair[0] == variable) return pair[1];
		}
		return false;
	}

}

$(function() {
	init();
});