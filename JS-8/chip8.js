var Chip8 = function (domcanv) {

	this.screen = domcanv;

	this.cpu = null;
	this.mem = null;
	this.ppu = null;
	this.keyboard = null;
	this.sound = null;

	// functions //

	this.Reset = function (rom) {

		console.log ('resetting console !');

		// init all components

		if (this.cpu)
			this.cpu.stopped = true;
		this.cpu = new Cpu (this);

		this.mem = new Mem (this, rom);
		this.ppu = new Ppu (this);
		this.keyboard = new keyboard (this);
		this.sound = new Sound (this);

		// init cpu:
		// kill and garbage collect current
		// program, hopefully this is a good
		// way to do this ?? idk

		this.cpu.Iterate ();

	};

};