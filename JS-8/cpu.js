var Cpu = function (c8, emuspeed) {

	//// FLAGS AND REGISTERS ////

	// program counter //
	this.pc = 0x200; // start at beggining of rom

	// registers //
	this.reg = new Uint8Array (16);
	this.i = 0;

	var f = 15; // carry reg

	this.keyclicked = false;

	// stack //
	this.stack = new Uint16Array (16);
	this.stackpt = 0;

	// timers //
	this.delaytimer = 0;
	this.soundtimer = 0;

	// emulation //
	this.stopped = false;
	this.shouldrefresh = false;
	this.emuspeed = emuspeed;

	//// FUNCTIONS ////

	this.Iterate = function () {

		var ram = c8.mem.ram;

		// get full opcode

		var opcode = ram [this.pc] << 8 | ram [this.pc + 1];

		// get individual properties of opcode

		var x = (opcode & 0x0f00) >> 8;
		var y = (opcode & 0x00f0) >> 4;

		var nnn = (opcode & 0x0fff);
		var kk = (opcode & 0x00ff);

		var hinibble = (opcode >> 12);
		var lonibble = (opcode & 0x000f);

		//// OPCODES ////

		switch (hinibble) {

			//// 	ZEROS
			case 0x0: {

				switch (kk) {

					case 0xe0:
						this.CLS ();
						break;
					case 0xee:
						this.RET ();
						break;
					default:
						this.SYSnnn (nnn);
						break;
				}
				break;

			}

			//// 	ONES
			case 0x1: {

				this.JPnnn (nnn);
				break;

			}

			//// 	TWOS
			case 0x2: {

				this.CALLnnn (nnn);
				break;

			}

			//// 	THREES
			case 0x3: {

				this.SExkk (x, kk);
				break;

			}

			//// 	FOURS
			case 0x4: {

				this.SNExkk (x, kk);
				break;

			}

			//// 	FIVES
			case 0x5: {

				this.SExy (x, y);
				break;

			}

			//// 	SIXES
			case 0x6: {

				this.LDxkk (x, kk);
				break;

			}

			//// 	SEVENS
			case 0x7: {

				this.ADDxkk (x, kk);
				break;

			}

			//// 	EIGHTS
			case 0x8: {

				switch (lonibble) {

					case 0x0: {
						this.LDxy (x, y);
						break;
					}
					case 0x1: {
						this.ORxy (x, y);
						break;
					}
					case 0x2: {
						this.ANDxy (x, y);
						break;
					}
					case 0x3: {
						this.XORxy (x, y);
						break;
					}
					case 0x4: {
						this.ADDxy (x, y);
						break;
					}
					case 0x5: {
						this.SUBxy (x, y);
						break;
					}
					case 0x6: {
						this.SHRx (x, y);
						break;
					}
					case 0x7: {
						this.SUBNxy (x, y);
						break;
					}
					case 0xe: {
						this.SHLx (x);
						break;
					}
					default: {
						console.log ('inv math op!:', opcode.toString (16));
						break;
					}

				}
				break;

			}

			//// 	NINES
			case 0x9: {

				this.SNExy (x, y);
				break;

			}

			//// 	TENS
			case 0xa: {

				this.LDinnn (nnn);
				break;

			}

			//// 	ELEVENS
			case 0xb: {

				this.JPv0nnn (x, nnn);
				break;

			}

			//// 	TWELVES
			case 0xc: {

				this.RNDxkk (x, kk);
				break;

			}

			//// 	THIRTEENS
			case 0xd: {

				this.DRWxyn (x, y, lonibble);
				break;

			}

			//// 	FOURTEENS
			case 0xe: {

				switch (kk) {

					case 0x9e: {
						this.SKPx (x);
						break;
					}
					case 0xa1: {
						this.SKNPx (x);
						break;
					}
					default: {
						console.log ('inv skip op!:', opcode.toString (16));
						break;
					}

				}
				break;

			}

			//// 	FIFTEENS
			case 0xf: {

				switch (kk) {

					case 0x07: {
						this.LDxdt (x);
						break;
					}
					case 0x0a: {
						this.LDxk (x);
						break;
					}
					case 0x15: {
						this.LDdtx (x);
						break;
					}
					case 0x18: {
						this.LDstx (x);
						break;
					}
					case 0x1e: {
						this.ADDix (x);
						break;
					}
					case 0x29: {
						this.LDfx (x);
						break;
					}
					case 0x33: {
						this.LDbx (x);
						break;
					}
					case 0x55: {
						this.LDix (x);
						break;
					}
					case 0x65: {
						this.LDxi (x);
						break;
					}
					default: {
						console.log ('inv timer op!:', opcode.toString (16));
						break;
					}

				}
				break;

			}

			//// 	???
			default: {
				console.log ('inv op!:', opcode.toString (16));
				break;
			}

		};

		// update timers

		/*if (c8.cpu.delaytimer > 0)
			c8.cpu.delaytimer --;
		if (c8.cpu.soundtimer > 0) {
			c8.sound.Beep ();
			c8.cpu.soundtimer --;
		}*/

		// increase program count

		this.pc += 2;

		// reset key state

		this.keyclicked = false;

	};

	this.LoopIterate = function () {

		if (this.stopped)
			return;

		for (var i = 0; i < this.emuspeed; i ++)
			this.Iterate ();

		var that = this;
		setTimeout (function () {

			that.LoopIterate ();

		}, 0);

	};

	//// ALL OPERATIONS ////

	this.SYSnnn = function (nnn) {

		// deprecated instruction ! so just skip

	};

	this.CLS = function () {

		// clear the screen with ppu
		c8.ppu.Clear ();

	};

	this.RET = function () {

		// return to last call, then decrease the stack by 1
		this.stackpt --;
		// if stack underflows, stop !
		if (this.stackpt < 0)
			c8.Stop ();
		this.pc = this.stack [this.stackpt];

	};

	this.JPnnn = function (nnn) {

		// jump to address (nnn)
		this.pc = nnn - 2;

	};

	this.CALLnnn = function (nnn) {
		this.stack [this.stackpt] = this.pc;
		// push pc to stack and jump to subroutine at adress (nnn)
		this.stackpt ++;
		// if stack overflows, stop !
		if (this.stackpt == 16)
			c8.Stop ();
		this.JPnnn (nnn);

	};

	this.SExkk = function (x, kk) {

		// if x == kk skip instruction
		this.pc += (this.reg [x] == kk) * 2;

	};

	this.SNExkk = function (x, kk) {

		// if x != kk skip instruction
		this.pc += (this.reg [x] != kk) * 2;

	};

	this.SExy = function (x, y) {

		// if x == y skip instruction
		this.pc += (this.reg [x] == this.reg [y]) * 2;

	};

	this.LDxkk = function (x, kk) {

		// load kk into x reg
		this.reg [x] = kk;

	};

	this.ADDxkk = function (x, kk) {

		// add kk to x reg
		this.reg [x] += kk;

	};

	this.LDxy = function (x, y) {

		// store y reg in x reg
		this.reg [x] = this.reg [y];

	};

	this.ORxy = function (x, y) {

		// store OR of x and y in x reg
		this.reg [x] = this.reg [x] | this.reg [y];

	};

	this.ANDxy = function (x, y) {

		// store AND of x and y in x reg
		this.reg [x] = this.reg [x] & this.reg [y];

	};

	this.XORxy = function (x, y) {

		// store XOR of x and y in x reg
		this.reg [x] = this.reg [x] ^ this.reg [y];

	};

	this.ADDxy = function (x, y) {

		// x = x + y, if sum > 255, f reg = 1; otherwise 0
		var sum = this.reg [x] + this.reg [y];
		this.reg [x] = sum;
		this.reg [f] = sum > 255 ? 1 : 0;

	};

	this.SUBxy = function (x, y) {

		// if x > y, f reg = 1; otherwise 0, x = x - y
		this.reg [f] = this.reg [x] > this.reg [y] ? 1 : 0;
		this.reg [x] = this.reg [x] - this.reg [y];

	};

	this.SHRx = function (x) {

		// f reg = x's least significant bit, then shift x to right once
		this.reg [f] = this.reg [x] & 1;
		this.reg [x] = this.reg [x] >> 1;

	};

	this.SUBNxy = function (x, y) {

		// f reg = 1; otherwise 0, x = y - x, if y > x
		this.reg [f] = this.reg [y] > this.reg [x] ? 1 : 0;
		this.reg [x] = this.reg [y] - this.reg [x];

	};

	this.SHLx = function (x) {

		// f reg = x's most significant bit, then shift x to left once
		this.reg [f] = !!(this.reg [x] & 0x80);
		this.reg [x] = this.reg [x] << 1;

	};

	this.SNExy = function (x, y) {

		// if x != y skip instruction
		this.pc += (this.reg [x] != this.reg [y]) * 2;

	};

	this.LDinnn = function (nnn) {

		// load i register with the adress index (nnn)
		this.i = nnn;

	};

	this.JPv0nnn = function (x, nnn) {

		// jump to adress (nnn + register 0)
		this.JPnnn (nnn + this.reg [0]);

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
		var w = c8.screenw;
		var h = c8.screenh;

		var col = 0;

		var px = ((this.reg [x]) % w) | 0;
		var py = ((this.reg [y]) % h) | 0;

		// starting from address i, read n amt of bytes to draw
		for (var i = 0; i < n; i ++) {

			var x = px;
			var y = py + i;

			if (y >= h)
				break;

			var byte = ram [i + this.i];

			for (var j = 0; j < 8; j ++) {

				if (x >= w)
					break;

				var bit = byte & (0x80 >> j) | 0;
				var ind = y * w + x;

				var xor = c8.ppu.TogglePx (ind, bit);
				if (!col)
					col = xor;

				x ++;

			}

		}

		this.reg [f] = col;

		this.shouldrefresh = true;

	};

	this.SKPx = function (x) {

		// if key with x reg is pressed, skip the next instruction
		var lowbits = (this.reg [x] & 0x0f);
		this.pc += (c8.keyboard.key [lowbits]) * 2;
	
	};

	this.SKNPx = function (x) {
	
		// if key with x reg is NOT pressed, skip the next instruction
		var lowbits = (this.reg [x] & 0x0f);
		this.pc += (!c8.keyboard.key [lowbits]) * 2;
	
	};
	
	this.LDxdt = function (x) {
	
		// load x reg with delay timer
		this.reg [x] = this.delaytimer;
	
	};
	
	this.LDxk = function (x) {
	
		// halt execution until key press, when pressed, store the key value in x reg
		if (!this.keyclicked)
			return this.pc -= 2;
		this.reg [x] = c8.keyboard.lastkeyclicked;
	
	};
	
	this.LDdtx = function (x) {
	
		// load delay timer with x reg
		this.delaytimer = this.reg [x];
	
	};
	
	this.LDstx = function (x) {
	
		// load sound timer with x reg
		this.soundtimer = this.reg [x];
	
	};
	
	this.ADDix = function (x) {
	
		// store the sum of i reg and x reg in i reg
		this.i += this.reg [x];
	
	};
	
	
	this.LDfx = function (x) {
	
		// set reg i to the location of the char sprite reg x points to
		var lowbits = (this.reg [x] & 0x0f); // because only 16 chars
		this.i = lowbits * 5; // multiply by 5 cuz char sprites made of 5 bytes
	
	};
	
	this.LDbx = function (x) {
	
		// for each digit in (decimal) x reg, store digit from mem index i
		// to mem index i + 3, (from hundreds to ones)
		var digits = [
			(this.reg [x] / 100) | 0,
			(this.reg [x] / 10 % 10) | 0,
			(this.reg [x] % 10) | 0
		];
	
		for (var i = 0; i < 3; i ++)
			c8.mem.ram [this.i + i] = (digits [i]) | 0;
	
	};
	
	this.LDix = function (x) {
	
		// store each of the registers from 0 to x at location i reg
		// counting location up every store
		for (var i = 0, l = x + 1; i < l; i ++)
			c8.mem.ram [this.i + i] = this.reg [i];
	
	};
	
	this.LDxi = function (x) {
	
		// store location i reg at registers 0 to x,
		// counting location up every store
		for (var i = 0, l = x + 1; i < l; i ++)
			this.reg [i] = c8.mem.ram [this.i + i];
	
	};

};