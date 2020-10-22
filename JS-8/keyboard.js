var Keyboard = function (c8) {

	// init keyboard keys //

	this.key = new Uint8Array (16) // 16 keys (0x0 - 0xf)

	this.lastkeyclicked = 0;

	this.firing = {};

	// 1 2 3 4 		- 0 1 2 3
	// Q W E R 		- 4 5 6 7
	// A S D F 		- 8 9 a b
	// Z X C V 		- c d e f

	//// FUNCTIONS ////

	this.changekeystate = function (keycode, state) {

		var code = keycode;

		switch (code) {

			//// 	KEYS 1 - 4
			case 49: { // 0x0
				this.key [0x1] = state;
				this.lastkeyclicked = 0x1;
				break;
			}
			case 50: { // 0x1
				this.key [0x2] = state;
				this.lastkeyclicked = 0x2;
				break;
			}
			case 51: { // 0x2
				this.key [0x3] = state;
				this.lastkeyclicked = 0x3;
				break;
			}
			case 52: { // 0x3
				this.key [0xc] = state;
				this.lastkeyclicked = 0xc;
				break;
			}

			//// 	KEYS Q - R
			case 81: { // 0x4
				this.key [0x4] = state;
				this.lastkeyclicked = 0x4;
				break;
			}
			case 87: { // 0x5
				this.key [0x5] = state;
				this.lastkeyclicked = 0x5;
				break;
			}
			case 69: { // 0x6
				this.key [0x6] = state;
				this.lastkeyclicked = 0x6;
				break;
			}
			case 82: { // 0x7
				this.key [0xd] = state;
				this.lastkeyclicked = 0xd;
				break;
			}

			//// 	KEYS A - F
			case 65: { // 0x8
				this.key [0x7] = state;
				this.lastkeyclicked = 0x7;
				break;
			}
			case 83: { // 0x9
				this.key [0x8] = state;
				this.lastkeyclicked = 0x8;
				break;
			}
			case 68: { // 0xa
				this.key [0x9] = state;
				this.lastkeyclicked = 0x9;
				break;
			}
			case 70: { // 0xb
				this.key [0xe] = state;
				this.lastkeyclicked = 0xe;
				break;
			}

			//// 	KEYS Z - V
			case 90: { // 0xc
				this.key [0xa] = state;
				this.lastkeyclicked = 0xa;
				break;
			}
			case 88: { // 0xd
				this.key [0x0] = state;
				this.lastkeyclicked = 0x0;
				break;
			}
			case 67: { // 0xe
				this.key [0xb] = state;
				this.lastkeyclicked = 0xb;
				break;
			}
			case 86: { // 0xf
				this.key [0xf] = state;
				this.lastkeyclicked = 0xf;
				break;
			}

			default: { // unrecognized key
				return false;
				break;
			}

		}

		return true;

	};

	var that = this;

	this.keydownhandler = function (e) {

		if (that.firing [e.keyCode])
			return;

		that.firing [e.keyCode] = true;

		if (that.changekeystate (e.keyCode, 1)) {
			c8.cpu.keyclicked = true;
		}

	};

	this.keyuphandler = function (e) {

		that.firing [e.keyCode] = false;

		that.changekeystate (e.keyCode, 0);

	};

};