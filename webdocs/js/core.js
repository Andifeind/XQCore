var CoreRouter = function(conf) {
	var CoreRouter,
		router ;

	CoreRouter = Backbone.Router.extend(conf);
	router = new CoreRouter();
	Backbone.history.start();
	return router;
};
var CorePresenter = (function() {

	var presenter = function(conf) {
		$.extend(this, conf, new CoreEvent(), new CoreLogger());
		this.name = (conf.name || 'Nameless') + 'Presenter';
		this.debug = Boolean(conf.debug);
		this.eventCallbacks = {};

		this.log('Initialize presenter with conf:', conf);
		this.init();
	};

	presenter.prototype.init = function() {

	};

	return presenter;
})();
var CoreModel = (function() {
	var isValid = false,
		model,
		modelData = null;

	model = function(conf) {
		$.extend(this, conf, new CoreEvent(), new CoreLogger());
		this.name = (conf.name || 'Nameless') + 'Model';
		this.debug = Boolean(conf.debug);

		if (conf.validate) {
			this.validate = function(formData) {
				var result;

				isValid = false;
				result = conf.validate.call(this, formData);
				if (!result || typeof result === 'object' && Object.keys(result).length === 0) {
					isValid = true;
				}

				return result;
			}.bind(this);
		}

		this.init();
	};

	model.prototype.init = function() {

	};

	model.prototype.validate = function() {

	};

	model.prototype.isValid = function() {
		return isValid;
	};

	/**
	 * Set model data
	 *
	 * @param {Object or String} data/key
	 * @param {Object} value Data value
	 */
	model.prototype.set = function() {
		var newData = {},
			validateResult;

		if (typeof arguments[0] === 'object') {
			//Add a dataset
			$.extend(newData, arguments[0]);
			this.log('Set data', arguments[0]);
		}
		else if (typeof arguments[0] === 'string') {
			newData[arguments[0]] = arguments[1];
			this.log('Set data', arguments[0], arguments[1]);
		}
		else {
			this.warn('Data are incorrect in model.set()', arguments);
		}

		if (this.validate) {
			validateResult = this.validate(newData);
			if (validateResult) {
				this.warn('Validate error in model.set', validateResult);
				return validateResult;
			}
		}

		modelData = newData;
	};

	/**
	 * Gets data from model
	 *
	 * @param  {String} key Data key
	 *
	 * @return {Object}     Model dataset
	 */
	model.prototype.get = function(key) {
		return modelData[key];
	};

	/**
	 * Check wether model has a dataset
	 *
	 * @param {String} key Dataset key
	 * @return {Boolean} Returns true if model has a dataset with key
	 */
	model.prototype.has = function(key) {
		return !!modelData[key];
	};

	/**
	 * Remove all data from model
	 */
	model.prototype.clean = function() {
		this.log('Clean model');
		modelData = null;
	};

	return model;
})();
var CoreView = (function() {

	var view = function(presenter, conf) {
		var self = this;

		$.extend(this, conf, new CoreEvent(), new CoreLogger());
		this.name = (conf.name || 'Nameless') + 'View';
		this.presenter = presenter;

		this.debug = Boolean(conf.debug);
		this.container = $(conf.container);
		if (this.container.length > 0) {
			window.addEventListener('resize', function(e) {
				self.resize(e);
			}, false);

			this.log('Initialize view with conf:', conf);
			this.log('  ... using Presenter:', this.presenter.name);
			this.log('  ... using Container:', this.container);

			//Send events to presenter
			Object.keys(this.events).forEach(function(key) {
				var split = key.split(' ', 2),
					eventFunc,
					eventName = split[0],
					selector = split[1] || null;

				if (split.length === 1 || split.length === 2) {
					eventFunc = this.presenter.events[this.events[key]];
					if (typeof eventFunc === 'function') {
						//Register event listener
						this.container.on(eventName, eventFunc);
						this.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);
					}
					else {
						this.warn('Event handler callback not defined in Presenter:', this.events[key]);
					}
				}
				else {
					this.warn('Incorect event configuration', key);
				}
			}, this);

			//Self init
			this.init();
		}
		else {
			this.error('Can\'t initialize View, Container not found!', this.container);
		}
	};

	view.prototype.init = function() {

	};

	view.prototype.show = function() {
		
	};

	view.prototype.hide = function() {
		
	};

	view.prototype.render = function() {
		
	};

	view.prototype.resize = function() {
		
	};



	return view;
})();
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

var CoreLogger = (function(conf) {

	var logger = function() {
		
	};

	logger.prototype.log = function() {
		var args;

		if (this.debug) {
			args = Array.prototype.slice.call(arguments);
			args.unshift('[' + this.name + ']');
			console.log.apply(console, args);
		}
	};

	logger.prototype.warn = function() {
		var args;

		if (this.debug) {
			args = Array.prototype.slice.call(arguments);
			args.unshift('[' + this.name + ']');
			console.warn.apply(console, args);
		}
	};

	logger.prototype.error = function() {
		var args;

		if (this.debug) {
			args = Array.prototype.slice.call(arguments);
			args.unshift('[' + this.name + ']');
			console.error.apply(console, args);
		}
	};

	return logger;
})();
/**
 * A bunch of helpfull functions
 *
 * @return {Object} Returns a singelton object instance of CoreUtil
 */
var CoreUtil = (function($) {

	var util = {
		name: 'CoreUtil',
		debug: true
	};

	/**
	 * Serialize a form and return its values as JSON
	 *
	 * @param {Object} Form selector
	 * @return {Object} FormData as JSON
	 */
	util.serializeForm = function(selector) {
		var formData = {},
			formSelector = $(selector);

		if (formSelector.get(0).tagName === 'INPUT') {

		}
		else {
			formSelector = formSelector.find(':input');
		}

		formSelector.serializeArray().forEach(function(item) {
			formData[item.name] = item.value;
		});

		if (this.debug) {
			console.log('Akonda Core - Serialize form:', formSelector, formData);
		}

		return formData;
	};

	/**
	 * Check length of a string or number
	 *
	 * @param {String or Number} input this will be checked
	 * @param {Number} min String can't be shorter than n, Number can't be lower than n
	 * @param {Number} max String can't be longer than n, Number can't be greater than n
	 *
	 * @returns {String} errorMessage on invalid or void on valid
	 */
	util.checkLength = function(input, min, max) {
		if (typeof input === 'Number') {
			if (input < min) {
				return 'num-to-small';
			}
			else if (input > max) {
				return 'num-to-large';
			}
		}
		else {
			console.log(input, input.length);
			if (input.length < min) {
				return 'str-to-short';
			}
			else if (input.length > max) {
				return 'str-to-long';
			}
		}
	};

	/**
	 * Checks the equality of two strings
	 *
	 * @param {String} str1 First string
	 * @param {String} str2 Second string
	 *
	 * @returns {String} errorMessage on invalid or void on valid
	 */
	util.checkEqual = function(str1, str2) {
		if (str1 !== str2) {
			return 'str-not-equal';
		}
	};

	/**
	 * Checks the validity of an email address
	 *
	 * @param {String} email e-Mail address
	 */
	util.checkEmail = function(email) {
		if (!/^\S+\@\S+\.[a-z]{2,10}$/.test(email)) {
			return 'invalid-email';
		}
	};

	return util;

})(jQuery);