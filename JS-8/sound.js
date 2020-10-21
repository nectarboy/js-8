var Sound = function (c8) {

	// init audio //

	this.ctx = new (AudioContext  || webkitAudioContext) ();

	// FUNCTIONS //

	this.Beep = function () {

		var osc = this.ctx.createOscillator ();

		osc.connect (this.ctx.destination);
	
		// custom settings //
	
		osc.type = 'triangle';
		osc.frequency.value = 500;
		duration = c8.cpu.soundtimer; // ms

		osc.start ();

		var that = this;

		setTimeout (function () {

			osc.stop ();
			osc.disconnect (that.ctx.destination);

		}, duration);

	};

};