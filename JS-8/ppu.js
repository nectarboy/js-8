var Ppu = function (c8) {

	var w = 64;
	var h = 32;

	var ar = w * h;

	// init canvas //

	this.ctx = c8.screen.getContext ('2d');
	this.ctx.fillStyle = '#fff'; // color of pixels

	// init vram //

	this.vram = new Uint8Array (ar); // area of screen

	//// FUNCTIONS ////

	this.Clear = function () {

		for (var i = 0; i < ar; i ++)
			vram [i] = 0;

	};

	this.Refresh = function () {

		var vram = this.vram;

		for (var i = 0; i < ar; i ++) {

			if (!vram [i])
				continue;

			// calculate x and y coordinates //
			var x = (vram [i] % w) | 0;
			var y = (vram [i] / w) | 0;

			ctx.fillRect (x, y, 1, 1);

		}

	};

};