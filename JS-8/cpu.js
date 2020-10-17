var Cpu = function (c8) {

	//// FLAGS AND REGISTERS ////

	// program counter //
	this.pc = 0x200; // start at beggining of rom

	// registers //
	this.reg = new Uint8Array (16);
	this.i = 0;

	var f = 15; // carry reg

	// stack //
	this.stack = new Uint16Array (16);
	this.stackpt = 0;

	// timers //
	this.delaytimer = 0;
	this.soundtimer = 0;

	// emulation //
	this.stopped = false;
	this.waitforkey = false;

	//// FUNCTIONS ////

	this.Iterate = function () {

		var ram = c8.mem.ram;

		// get full opcode

		var opcode = ram [this.pc] << 8 | ram [this.pc + 1];
		console.log ('opcode:', opcode.toString (16));

		//// OPCODES ////

		switch (opcode) {

			// ... 

		};

		// update timers

		if (this.delaytimer > 0)
			this.delaytimer --;
		if (this.soundtimer > 0)
			this.soundtimer --;

	};

	//// ALL OPERATIONS ////

	this.SYSaddr = function (nnn) {

		// deprecated
		this.pc += 2;

	};

	this.CLS = function () {

		// clear the screen
		c8.ppu.Clear ();
		this.pc += 2;

	};

	this.RET = function () {

		// return to last call, then decrease the stack by 1
		this.pc = this.stack [this.stackpt];

		this.stackpt --;
		// if stack underflows, stop !
		this.stopped = this.stackpt < 0 ? true : falsel

	};

	this.JPnnn = function (nnn) {

		// jump to address (nnn)
		this.pc = nnn;

	};

	this.CALLnnn = function (nnn) {

		// push pc to stack and jump to subroutine at adress (nnn)
		this.stackpt ++;
		// if stack overflows, stop !
		this.stopped = this.stackpt > 15 ? true : false;

		this.stack [this.stackpt] = this.pc;
		this.pc = nnn;

	};

	this.SExkk = function (x, kk) {

		// if x == kk skip instruction
		this.pc += (this.reg [x] == kk * 2);

	};

	this.SNExkk = function (x, kk) {

		// if x != kk skip instruction
		this.pc += (this.reg [x] != kk * 2);

	};

	this.SExy = function (x, y) {

		// if x == y skip instruction
		this.pc += (this.reg [x] == this.reg [y] * 2);

	};

	this.LDxkk = function (x, kk) {

		// load kk into x reg
		this.reg [x] = kk;
		this.pc += 2;

	};

	this.ADDxkk = function (x, kk) {

		// add kk to x reg
		this.reg [x] += kk;
		this.pc += 2;

	};

	this.LDxy = function (x, y) {

		// store y reg in x reg
		this.reg [x] = this.reg [y];
		this.pc += 2;

	};

	this.ORxy = function (x, y) {

		// store OR of x and y in x reg
		this.reg [x] = this.reg [x] | this.reg [y];
		this.pc += 2;

	};

	this.ANDxy = function (x, y) {

		// store AND of x and y in x reg
		this.reg [x] = this.reg [x] & this.reg [y];
		this.pc += 2;

	};

	this.XORxy = function (x, y) {

		// store XOR of x and y in x reg
		this.reg [x] = this.reg [x] ^ this.reg [y];
		this.pc += 2;

	};

	this.ADDxy = function (x, y) {

		// x = x + y, if sum > 255, f reg = 1; otherwise 0
		var sum = this.reg [x] = this.reg [x] + this.reg [y];
		this.reg [f] = sum > 255 ? 1 : 0;
		this.pc += 2;

	};

	this.SUBxy = function (x, y) {

		// x = x - y, if x > y, f reg = 1; otherwise 0
		this.reg [x] = this.reg [x] - this.reg [y];
		this.reg [f] = this.reg [x] > this.reg [y] ? 1 : 0;
		this.pc += 2;

	};

	this.SHRx = function (x) {

		// f reg = x's least significant bit, then shift x to right once
		this.reg [f] = this.reg [x] & 1;
		this.reg [x] >> 1;
		this.pc += 2;

	};

	this.SUBN = function (x, y) {

		// x = y - x, if y > x, f reg = 1; otherwise 0
		this.reg [x] = this.reg [y] - this.reg [x];
		this.reg [f] = this.reg [y] > this.reg [x] ? 1 : 0;
		this.pc += 2;

	};

	this.SHLx = function (x) {

		// f reg = x's most significant bit, then shift x to left once
		this.reg [f] = (this.reg [x] >> 7) & 1;
		this.reg [x] << 1;
		this.pc += 2;

	};

	this.SNExy = function (x, y) {

		// if x != y skip instruction
		this.pc += (this.reg [x] != this.reg [y] * 2);

	};

	this.LDinnn = function (nnn) {

		// load i register with the adress index (nnn)
		this.i = nnn;

	};

	this.JPv0nnn = function (nnn) {

		// jump to adress (nnn + register 0)
		this.pc = nnn + this.register [0];

	};

	this.RNDxkk = function (x, kk) {

		// generate a num (0 - 255), AND with kk, and store result in x reg
		var num = Math.round (Math.random () * 255);
		this.reg [x] = num & kk;

	};

	this.DRWxyn = function (x, y, n) {

		// drawing a sprite on screen ... this gon be tough ...
		var ram = c8.mem.ram;
		var vram = c8.ppu.vram;
		var w = c8.ppu.w;

		var col = 0;

		// starting from address i, read n amt of bytes to draw
		for (var i = this.i; i < n; i ++) {

			var px = this.reg [x];
			var py = this.reg [y];

			var ct = 0;

			var bin = ram [i].toString (2);

			for (var j = 0, l = bin.length; j < l; j ++) {

				if (ct == 8) {

					px -= 8;
					py ++;
					ct = 0;

				}
				else
					ct ++;

				var bit = bin [j] | 0;
				var ind = py * w + px;
				var prevrambit = vram [ind];

				vram [ind] = bit ^ vram [ind];

				if (!col)
					col = (prevrambit && !vram [ind]) | 0;

				px ++;

			}

		}

		this.reg [f] = col;

	};

};