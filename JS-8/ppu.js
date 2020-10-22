var Ppu = function (c8) {

	var w = c8.screenw;
	var h = c8.screenh;

	var ar = w * h;

	// init canvas //

	this.ctx = c8.screen.getContext ('2d');
	this.ctx.fillStyle = '#fff'; // color of pixels

	// init vram //

	this.vram = new Uint8Array (ar); // area of screen

	// emulation //

	this.refreshrate = 1000 / 60; // 60 hz

	//// FUNCTIONS ////

	this.Clear = function () {

		for (var i = 0; i < ar; i ++)
			this.vram [i] = 0;

	};

	this.TogglePx = function (ind, bit) {

		var vram = this.vram;
		var col = (vram [ind] && bit) ? 1 : 0;
		vram [ind] = vram [ind] ^ bit;

		return col;

	};

	this.Refresh = function () {

		if (!c8.cpu.shouldrefresh)
			return;

		this.ctx.clearRect (0, 0, w, h);

		for (var i = 0; i < ar; i ++) {

			if (!this.vram [i])
				continue;

			// calculate x and y coordinates //
			var x = (i % w) | 0;
			var y = (i / w) | 0;

			this.ctx.fillRect (x, y, 1, 1);

		}

		c8.cpu.shouldrefresh = false;

	};

	this.LoopRefresh = function () {

		if (c8.cpu.stopped)
			return;

		this.Refresh ();

		// since this function happens every 60 hz
		// might as well update the timers !

		if (c8.cpu.delaytimer > 0)
			c8.cpu.delaytimer --;
		if (c8.cpu.soundtimer > 0) {
			c8.sound.Beep ();
			c8.cpu.soundtimer = 0;
		}

		var that = this;
		setTimeout (function () {
			that.LoopRefresh ();
		}, this.refreshrate);

	};

};