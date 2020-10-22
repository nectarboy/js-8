var Chip8 = function (domcanv) {

	this.screen = domcanv;

	this.screenw = 64;
	this.screenh = 32;

	this.cpu = null;
	this.mem = null;
	this.ppu = null;
	this.keyboard = null;
	this.sound = null;

	// functions //

	this.Reset = function (emuspeed, rom) {

		console.log ('resetting console !');

		// reset all components

		this.cpu = new Cpu (this, emuspeed);
		this.mem = new Mem (this, rom);
		this.ppu = new Ppu (this);
		this.keyboard = new Keyboard (this);
		this.sound = new Sound (this);

		// keyboard init

		document.onkeydown = this.keyboard.keydownhandler;
		document.onkeyup = this.keyboard.keyuphandler;

		// init cpu and ppu

		this.cpu.LoopIterate ();
		this.ppu.LoopRefresh ();

	};

	this.Stop = function () {

		// about the cpu:
		// kill and garbage collect current
		// program, hopefully this is a good
		// way to do this ?? idk

		if (this.cpu)
			this.cpu.stopped = true;

		document.onkeydown = null;
		document.onkeyup = null;

	};

};