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
		var self = this;
		
		this.root = '/';
		this.debug = false;
		
		conf = conf || {};

		$.extend(this, conf, new CoreEvent(), new CoreLogger());
		this.name = (conf.name || 'Nameless') + 'Presenter';
		this.eventCallbacks = {};

		this.log('Initialize presenter with conf:', conf);
		this.init();

		//Setup popstate listener
		if (conf.routes) {
			window.addEventListener('popstate', function(e) {
				self.log('popstate event recived', e);
				if (!e.state) {
					return;
				}

				var tag = e.state.tag,
					url = e.state.url;

				if (typeof conf[tag] === 'function') {
					conf[tag].call(self, e.state.data);
				}
			}, false);

			window.addEventListener('hashchange', function(e) {
				self.log('hashchange event recived', e, location.hash);
				var tag = location.hash.substring(1);

				if (typeof conf[tag] === 'function') {
					self.log('Call func', conf[tag]);
					conf[tag].call(self);
				}
			}, false);
		}
	};

	presenter.prototype.init = function() {

	};

	/**
	 * Calling on view init
	 *
	 * @param {object} view The initializing view
	 */
	presenter.prototype.viewInit = function(view) {

			console.log('I',view.name, view);
	};

	/**
	 * Add a history item to the browser history
	 */
	presenter.prototype.pushState = function(data, title, url) {
		history.pushState(data,title,url);
	};

	return presenter;
})();

var CoreModel = (function(window, document, $, undefined) {
	var model;

	model = function(conf) {
		if (conf === undefined) {
			conf = {};
		}

		$.extend(this, conf, new CoreEvent(), new CoreLogger());
		this.name = (conf.name || 'Nameless') + 'Model';
		this.debug = Boolean(conf.debug);
		this.attributes = {};
		this._isValid = false;

		if (conf.validate) {
			this.validate = function(formData) {
				var result;

				this._isValid = false;
				result = conf.validate.call(this, formData);
				if (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {
					this._isValid = true;
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
		return this._isValid;
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

		$.extend(this.attributes, newData);
	};

	/**
	 * Get one or all attributes from model
	 *
	 * @param  {String} key Data key
	 *
	 * @return {Object}     Model dataset
	 */
	model.prototype.get = function(key) {
		if (key === undefined) {
			return this.attributes;
		}
		else {
			return this.attributes[key];
		}
	};

	/**
	 * Check wether model has a dataset
	 *
	 * @param {String} key Dataset key
	 * @return {Boolean} Returns true if model has a dataset with key
	 */
	model.prototype.has = function(key) {
		return !!this.attributes[key];
	};

	/**
	 * Remove all data from model
	 */
	model.prototype.reset = function() {
		this.log('Reset model');
		this.attributes = {};
	};

	/**
	 * Send an ajax request to a webserver. Sends all models attributes
	 *
	 * You must set the server URI first with model.server = 'http://example.com/post'
	 *
	 * @param {String} Method send method, GET, POST, PUT, DELETE (default POST)
	 * @param {Function} callback Calls callback(err, data, status, jqXHR) if response was receiving
	 */
	model.prototype.send = function(method, callback) {
		var data;

		method = method || 'POST';

		data = this.get();

		if (!this.server) {
			this.error('Can not send an ajax request! You must define a server URL first.');
			return false;
		}

		this.log('Sending an ajax call to ', this.server, 'with data: ', data);

		$.ajax({
			url: this.server,
			method: method,
			data: data,
			success: function(data, status, jqXHR) {
				callback.call(this, null, data, status, jqXHR);
			}.bind(this),
			error: function(jqXHR, status, error) {
				callback.call(this, {
					type: status,
					http: error
				}, null, status, jqXHR);
			}.bind(this)
		});
	};

	return model;
})(window, document, jQuery);

var CoreView = (function() {

	var view = function(presenter, conf) {
		var self = this;

		conf = conf || {
			events: null
		};

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
			if (this.events) {
				Object.keys(this.events).forEach(function(key) {
					var split = key.split(' ', 2),
						eventFunc,
						eventName = split[0],
						selector = split[1] || null,
						self = this;

					if (split.length === 1 || split.length === 2) {
						eventFunc = this.presenter.events[this.events[key]];
						if (typeof eventFunc === 'function') {
							//Register event listener
							this.container.on(eventName, function(e) {
								var formData = null,
									tagData = null;

								if (e.type === 'submit') {
									formData = CoreUtil.serializeForm(e.target);
									tagData = $(e.target).data();
								}

								eventFunc.call(self.presenter, e, tagData, formData);
							});
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
			} else {
				this.warn('No view events defined');
			}

			//Self init
			this.init();

			//Call presenter.initView()
			this.presenter.viewInit(this);
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

	view.prototype.render = function(data) {
		this.log('Render view template', this.template, 'with data:', data);
		var template = Handlebars.compile(this.template);
		this.container.html(template(data));
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

	//var timerStore = {};

	function getHumanTime(time) {
		if (time < 1000) {
			return time + ' ms';
		}
		else if (time < 60000) {
			return (Math.round(time / 100) / 10) + ' sec';
		}
		else {
			return (Math.round(time / 60000)) + ' min ' + Math.round(time % 60000 / 1000) + ' sec';
		}
	}

	function onScreenConsole() {
		var conf,
			html;

		conf = localStorage.get('core-onscreen-console') || {
			pos: 'bottom'
		};

		html = '<div id="CoreLogger-OnScreenConsole">\
			</div>';
	}

	/**
	 * CoreLogger is a logging tool to log messages, warnings, errors to the browser or onscreen console
	 *
	 * @return {[type]} [description]
	 */
	var logger = function() {
		
	};

	/**
	 * Loggs a message to the console
	 *
	 * @param {Any} msg logs all arguments to the console
	 */
	logger.prototype.log = function() {
		var args;

		if (this.debug) {
			args = Array.prototype.slice.call(arguments);
			args.unshift('[' + this.name + ']');
			console.log.apply(console, args);
		}
	};

	/**
	 * Loggs a warning to the console
	 *
	 * @param {Any} msg logs all arguments to the console
	 */
	logger.prototype.warn = function() {
		var args;

		if (this.debug) {
			args = Array.prototype.slice.call(arguments);
			args.unshift('[' + this.name + ']');
			console.warn.apply(console, args);
		}
	};

	/**
	 * Loggs a error message to the console
	 *
	 * @param {Any} msg logs all arguments to the console
	 */
	logger.prototype.error = function() {
		var args;

		if (this.debug) {
			args = Array.prototype.slice.call(arguments);
			args.unshift('[' + this.name + ']');
			console.error.apply(console, args);
		}
	};

	/**
	 * Start a timeTracer
	 *
	 * @param {String} timerName Set the name for your (Optional)
	 * @return {Object} Returns a TimerObject
	 */
	logger.prototype.timer = function(name) {
		var timer = {
			start: null,
			stop: null,
			name: name,
			logger: this,
			end: function() {
				this.stop = Date.now();
				this.logger.log('Timer ' + this.name + ' runs: ', getHumanTime(this.stop - this.start));
			}
		};

		/*if (name) {
			this.timerStore[name] = timer;
		}*/

		this.log('Start Timer', name);

		//Set timer start time
		timer.start = Date.now();
		return timer;
	};

	/**
	 * Stops a timer
	 *
	 * @param {String or Object} timerName Stops the given timer
	 */
	logger.prototype.timerEnd = function(timer) {
		//Set stop timer
		
	};

	logger.prototype.__scope = {
		getHumanTime: getHumanTime
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