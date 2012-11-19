var CoreEvent = (function() {
	var ee,
		event;
	
	function indexOf(eventName, callback) {
		this.objectName = 'CoreEvent';
		
		var len = this.store.length,
			i = 0,
			el;

		for (; i < len; i++) {
			el = this.store[i];
			if (eventName === null || eventName === el.event && callback === null || callback === el.callback) {
				return el;
			}
		}

		return null;
	}


	event = function(conf) {
		this.store = [];
	};

	// event.prototype.on = function(eventName, callback) {

	// };

	// event.prototype.once = function(eventName, callback) {

	// };

	// event.prototype.emit = function(eventName, data) {

	// };

	// event.prototype.remove = function(eventName, callback) {

	// };

	ee = new EventEmitter();
	event.prototype.emit = function(eventName, data) {
		if (this.debug) {
			console.debug('Akonda Core - Emit event', eventName, data);
		}
		return ee.emitEvent(eventName, [data]);
	};

	event.prototype.on = function(eventName, listener) {
		if (this.debug) {
			console.debug('Akonda Core - Add listener', eventName, listener);
		}
		return ee.addListener(eventName, listener);
	};

	event.prototype.once = function(eventName, listener) {
		var onceListener = function() {
			ee.removeListener(eventName, listener);
			listener.call(null, arguments);
			return true;
		};

		if (this.debug) {
			console.debug('Akonda Core - Add once listener', eventName, listener);
		}
		return ee.addListener(eventName, onceListener);
	};

	event.prototype.off = function(eventName, listener) {
		if (this.debug) {
			console.debug('Akonda Core - Remove listener', eventName, listener);
		}

		if (listener === undefined) {
			return ee.removeEvent(eventName);
		}
		else {
			return ee.removeListener(eventName, listener);
		}
	};

	return event;
})();
