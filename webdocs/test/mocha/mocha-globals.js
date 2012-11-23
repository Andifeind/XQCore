if (!"console" in window) {
	var console = {
		log: function() {},
		warn: function() {},
		info: function() {},
		error: function() {}
	};
}