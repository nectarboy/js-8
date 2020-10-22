var Sound = function (c8) {

	// init audio //

	var audclass = window.AudioContext || window.webkitAudioContext;

	this.ctx = new audclass ();

	// FUNCTIONS //

	this.Beep = function () {

		var osc = this.ctx.createOscillator ();
	
		// custom settings
	
		osc.type = 'triangle';
		osc.frequency.value = 500;
		duration = c8.cpu.soundtimer * 2; // ms

		// start

		osc.connect (this.ctx.destination);

		osc.start ();

		var that = this;

		setTimeout (function () {

			osc.stop ();

		}, duration);

	};

};