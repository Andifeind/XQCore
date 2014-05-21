/*!
 * XQCore - +0.8.0-24
 * 
 * Model View Presenter Javascript Framework
 *
 * XQCore is licenced under MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Copyright (c) 2012 - 2014 Noname Media, http://noname-media.com
 * Author Andi Heinkelein
 *
 * Creation Date: 2014-05-21
 */

/*global XQCore:true */
var XQCore;

(function (root, factory) {
	/*global define:false */
	'use strict';

	if (typeof define === 'function' && define.amd) {
		define('xqcore', ['jquery'], factory);
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory(require('jquery'));
	} else {
		root.XQCore = factory(root.jQuery);
	}
}(this, function (jQuery) {
	'use strict';

	/**
	 * XQCore main object
	 *
	 * @package XQcore
	 * @type {Object}
	 */
	XQCore = {
		version: '0.8.0-24',
		defaultRoute: 'index',
		html5Routes: false,
		hashBang: '#!',
		callerEvent: 'callerEvent',
		objectIdPattern: /^[a-zA-Z0-9]{24}$/,
		templateEngine: 'firetpl',
		viewsDir: './views/',
		viewExt: '.fire'
	};

	//XQCore helper functions
	XQCore.extend = jQuery.extend;
	XQCore.isEmptyObject = jQuery.isEmptyObject;
	XQCore.isPlainObject = jQuery.isPlainObject;
	XQCore.isFunction = jQuery.isFunction;
	
	/**
	 * Checks for a valid ObjectId
	 * 
	 * The pattern of an objectId can be overwritten by setting the XQCore.objectIdPattern property
	 *
	 * @return {Boolean} Returns true if value is an valid objectId
	 */
	XQCore.isObjectId = function(value) {
		return this.objectIdPattern.test(value);
	};

	XQCore._dump = {};
	XQCore.dump = function(componentName) {
		if (XQCore._dump[componentName]) {
			console.log('[XQCore dump]', componentName, XQCore._dump[componentName]);
			return XQCore._dump[componentName];
		}

		return false;
	};

	XQCore.include = function(moduleName) {
		if (moduleName === 'jquery') {
			return jQuery;
		}
	};

	return XQCore;
}));


/**
 * XQCore EventEmitter
 *
 * Based on EventEmitter v4.2.5 by Oliver Caldwell
 * http://git.io/ee
 *
 */
(function(XQCore, undefined) {
	'use strict';

	//EventEmitter.js

	/*!
	 * EventEmitter v4.2.5 - git.io/ee
	 * Oliver Caldwell
	 * MIT license
	 * @preserve
	 */


	/**
	 * Class for managing events.
	 * Can be extended to provide event functionality in other classes.
	 *
	 * @class EventEmitter Manages event registering and emitting.
	 */
	function EventEmitter() {}

	// Shortcuts to improve speed and size
	var proto = EventEmitter.prototype;

	/**
	 * Finds the index of the listener for the event in it's storage array.
	 *
	 * @param {Function[]} listeners Array of listeners to search through.
	 * @param {Function} listener Method to look for.
	 * @return {Number} Index of the specified listener, -1 if not found
	 * @api private
	 */
	function indexOfListener(listeners, listener) {
		var i = listeners.length;
		while (i--) {
			if (listeners[i].listener === listener) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * Alias a method while keeping the context correct, to allow for overwriting of target method.
	 *
	 * @param {String} name The name of the target method.
	 * @return {Function} The aliased method
	 * @api private
	 */
	function alias(name) {
		return function aliasClosure() {
			return this[name].apply(this, arguments);
		};
	}

	/**
	 * Returns the listener array for the specified event.
	 * Will initialise the event object and listener arrays if required.
	 * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	 * Each property in the object response is an array of listener functions.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Function[]|Object} All listener functions for the event.
	 */
	proto.getListeners = function getListeners(evt) {
		var events = this._getEvents();
		var response;
		var key;

		// Return a concatenated array of all matching events if
		// the selector is a regular expression.
		if (typeof evt === 'object') {
			response = {};
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					response[key] = events[key];
				}
			}
		}
		else {
			response = events[evt] || (events[evt] = []);
		}

		return response;
	};

	/**
	 * Takes a list of listener objects and flattens it into a list of listener functions.
	 *
	 * @param {Object[]} listeners Raw listener objects.
	 * @return {Function[]} Just the listener functions.
	 */
	proto.flattenListeners = function flattenListeners(listeners) {
		var flatListeners = [];
		var i;

		for (i = 0; i < listeners.length; i += 1) {
			flatListeners.push(listeners[i].listener);
		}

		return flatListeners;
	};

	/**
	 * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Object} All listener functions for an event in an object.
	 */
	proto.getListenersAsObject = function getListenersAsObject(evt) {
		var listeners = this.getListeners(evt);
		var response;

		if (listeners instanceof Array) {
			response = {};
			response[evt] = listeners;
		}

		return response || listeners;
	};

	/**
	 * Adds a listener function to the specified event.
	 * The listener will not be added if it is a duplicate.
	 * If the listener returns true then it will be removed after it is called.
	 * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListener = function addListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var listenerIsWrapped = typeof listener === 'object';
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
				listeners[key].push(listenerIsWrapped ? listener : {
					listener: listener,
					once: false
				});
			}
		}

		return this;
	};

	/**
	 * Alias of addListener
	 */
	proto.on = alias('addListener');

	/**
	 * Semi-alias of addListener. It will add a listener that will be
	 * automatically removed after it's first execution.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addOnceListener = function addOnceListener(evt, listener) {
		return this.addListener(evt, {
			listener: listener,
			once: true
		});
	};

	/**
	 * Alias of addOnceListener.
	 */
	proto.once = alias('addOnceListener');

	/**
	 * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	 * You need to tell it what event names should be matched by a regex.
	 *
	 * @param {String} evt Name of the event to create.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvent = function defineEvent(evt) {
		this.getListeners(evt);
		return this;
	};

	/**
	 * Uses defineEvent to define multiple events.
	 *
	 * @param {String[]} evts An array of event names to define.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.defineEvents = function defineEvents(evts) {
		for (var i = 0; i < evts.length; i += 1) {
			this.defineEvent(evts[i]);
		}
		return this;
	};

	/**
	 * Removes a listener function from the specified event.
	 * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to remove the listener from.
	 * @param {Function} listener Method to remove from the event.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListener = function removeListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var index;
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				index = indexOfListener(listeners[key], listener);

				if (index !== -1) {
					listeners[key].splice(index, 1);
				}
			}
		}

		return this;
	};

	/**
	 * Alias of removeListener
	 */
	proto.off = alias('removeListener');

	/**
	 * Adds listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	 * You can also pass it a regular expression to add the array of listeners to all events that match it.
	 * Yeah, this function does quite a bit. That's probably a bad thing.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.addListeners = function addListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(false, evt, listeners);
	};

	/**
	 * Removes listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be removed.
	 * You can also pass it a regular expression to remove the listeners from all events that match it.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeListeners = function removeListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(true, evt, listeners);
	};

	/**
	 * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	 * The first argument will determine if the listeners are removed (true) or added (false).
	 * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be added/removed.
	 * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	 *
	 * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
		var i;
		var value;
		var single = remove ? this.removeListener : this.addListener;
		var multiple = remove ? this.removeListeners : this.addListeners;

		// If evt is an object then pass each of it's properties to this method
		if (typeof evt === 'object' && !(evt instanceof RegExp)) {
			for (i in evt) {
				if (evt.hasOwnProperty(i) && (value = evt[i])) {
					// Pass the single listener straight through to the singular method
					if (typeof value === 'function') {
						single.call(this, i, value);
					}
					else {
						// Otherwise pass back to the multiple function
						multiple.call(this, i, value);
					}
				}
			}
		}
		else {
			// So evt must be a string
			// And listeners must be an array of listeners
			// Loop over it and pass each one to the multiple method
			i = listeners.length;
			while (i--) {
				single.call(this, evt, listeners[i]);
			}
		}

		return this;
	};

	/**
	 * Removes all listeners from a specified event.
	 * If you do not specify an event then all listeners will be removed.
	 * That means every event will be emptied.
	 * You can also pass a regex to remove all events that match it.
	 *
	 * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.removeEvent = function removeEvent(evt) {
		var type = typeof evt;
		var events = this._getEvents();
		var key;

		// Remove different things depending on the state of evt
		if (type === 'string') {
			// Remove all listeners for the specified event
			delete events[evt];
		}
		else if (type === 'object') {
			// Remove all events matching the regex.
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					delete events[key];
				}
			}
		}
		else {
			// Remove all listeners in all events
			delete this._events;
		}

		return this;
	};

	/**
	 * Alias of removeEvent.
	 *
	 * Added to mirror the node API.
	 */
	proto.removeAllListeners = alias('removeEvent');

	/**
	 * Emits an event of your choice.
	 * When emitted, every listener attached to that event will be executed.
	 * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	 * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	 * So they will not arrive within the array on the other side, they will be separate.
	 * You can also pass a regular expression to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {Array} [args] Optional array of arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emitEvent = function emitEvent(evt, args) {
		var listeners = this.getListenersAsObject(evt);
		var listener;
		var i;
		var key;
		var response;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				i = listeners[key].length;

				while (i--) {
					// If the listener returns true then it shall be removed from the event
					// The function is executed either with a basic call or an apply if there is an args array
					listener = listeners[key][i];

					if (listener.once === true) {
						this.removeListener(evt, listener.listener);
					}

					response = listener.listener.apply(this, args || []);

					if (response === this._getOnceReturnValue()) {
						this.removeListener(evt, listener.listener);
					}
				}
			}
		}

		return this;
	};

	/**
	 * Alias of emitEvent
	 */
	proto.trigger = alias('emitEvent');

	/**
	 * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	 * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {...*} Optional additional arguments to be passed to each listener.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.emit = function emit(evt) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.emitEvent(evt, args);
	};

	/**
	 * Sets the current value to check against when executing listeners. If a
	 * listeners return value matches the one set here then it will be removed
	 * after execution. This value defaults to true.
	 *
	 * @param {*} value The new value to check for when executing listeners.
	 * @return {Object} Current instance of EventEmitter for chaining.
	 */
	proto.setOnceReturnValue = function setOnceReturnValue(value) {
		this._onceReturnValue = value;
		return this;
	};

	/**
	 * Fetches the current value to check against when executing listeners. If
	 * the listeners return value matches this one then it should be removed
	 * automatically. It will return true by default.
	 *
	 * @return {*|Boolean} The current value to check for or the default, true.
	 * @api private
	 */
	proto._getOnceReturnValue = function _getOnceReturnValue() {
		if (this.hasOwnProperty('_onceReturnValue')) {
			return this._onceReturnValue;
		}
		else {
			return true;
		}
	};

	/**
	 * Fetches the events object and creates one if required.
	 *
	 * @return {Object} The events storage object.
	 * @api private
	 */
	proto._getEvents = function _getEvents() {
		return this._events || (this._events = {});
	};

	XQCore.Event = EventEmitter;

})(XQCore);

/**
 * XQCore Logger
 *
 * Based on EventEmitter.js
 * 
 * 
 */
(function(XQCore, undefined) {
	'use strict';

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

	/**
	 * XQCore Logger is a logging tool to log messages, warnings, errors to the browser or onscreen console
	 *
	 * @module XQCore.Logger
	 * @class XQCore.Logger
	 *
	 */
	var Logger = function() {
		
	};

	/**
	 * Loggs a message to the console
	 *
	 * @method log
	 *
	 * @param {Any} msg logs all arguments to the console
	 */
	Logger.prototype.log = function() {
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
	 * @method warn
	 * @param {Any} msg logs all arguments to the console
	 */
	Logger.prototype.warn = function() {
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
	 * @method error
	 * @param {Any} msg logs all arguments to the console
	 */
	Logger.prototype.error = function() {
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
	 * @method timer
	 * @param {String} timerName Set the name for your (Optional)
	 * @return {Object} Returns a TimerObject
	 */
	Logger.prototype.timer = function(name) {
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

	Logger.prototype.__scope = {
		getHumanTime: getHumanTime
	};
	

	XQCore.Logger = Logger;

})(XQCore);
/**
 *	@requires XQCore.Utils
 *	@requires XQCore.Event
 *	@requires XQCore.Logger
 */
(function(XQCore, undefined) {
	'use strict';
	var Model;

	Model = function(name, conf) {
		if (typeof arguments[0] === 'object') {
			conf = name;
			name = conf.name;
		}

		/**
		 * Enable debug mode
		 * @public
		 * @type {Boolean}
		 */
		this.debug = XQCore.debug;

		if (conf === undefined) {
			conf = {};
		}

		this.__state = 'starting';
		this.__unfiltered = {};

		this.customValidate = conf.validate;
		delete conf.validate;

		this.conf = conf;

		this.name = (name ? name.replace(/Model$/, '') : 'Nameless') + 'Model';
		this._isValid = false;
		this.properties = {};
		this.schema = conf.schema;
	};


	XQCore.extend(Model.prototype, new XQCore.Event(), new XQCore.Logger());

	if (XQCore.Sync) {
		XQCore.extend(Model.prototype, XQCore.Sync.prototype);
	}

	Model.prototype.init = function() {
		var self = this,
			conf = this.conf;

		if (typeof conf === 'function') {
			conf.call(this, self);
		}
		else {
			XQCore.extend(this, conf);
		}

		if (this.debug) {
			XQCore._dump[this.name] = this;
		}

		//Add default values
		if (this.defaults && !XQCore.isEmptyObject(this.defaults)) {
			this.set(this.defaults);
		}

		this.state('ready');
	};

	/**
	 * Change the model state
	 *
	 * @method state
	 * @param {String} state New state
	 */
	Model.prototype.state = function(state) {
		this.__state = state;
		this.emit('state.' + state);
		this.emit('state.change', state);
	};

	/**
	 * Get the current model state
	 *
	 * @method getState
	 */
	Model.prototype.getState = function() {
		return this.__state;
	};

	/**
	 * Set model data
	 *
	 * Triggers a data.change event if data was set succesfully
	 *
	 * @method set
	 * @param {Object} data
	 */
	
	/**
	 * Set model data
	 *
	 * Triggers these events if data was set succesfully<br>
	 * data.change<br>
	 * &lt;key&gt;.change
	 *
	 * options: {
	 *   silent: <Boolean> Don't trigger any events
	 *   noValidation: <Boolean> Don't validate
	 *   validateOne: <Boolean> Only if setting one item, validate the item only
	 * }
	 *
	 * @method set
	 * @param {String} key
	 * @param {Object} value Data value
	 * @param {Object} options Options
	 */
	Model.prototype.set = function(key, value, options) {
		var newData = {},
			oldData = this.get(),
			validateResult,
			setItem = false,
			setAll = false;

		options = options || {};

		if (arguments[0] === null) {
			newData = arguments[1];
			setAll = true;
			this.log('Set data', newData, oldData);
		}
		else if (typeof arguments[0] === 'object') {
			//Add a dataset
			key = null;
			options = value || {};
			newData = options.extend ? XQCore.extend(newData, oldData, arguments[0]) : arguments[0];
			setAll = true;
			this.log('Set data', newData, oldData);
		}
		else if (typeof arguments[0] === 'string') {
			newData = XQCore.extend({}, this.get());
			setItem = true;
			XQCore.dedotify(newData, key, value);
			this.log('Set data', newData, oldData);

			options = options || {};
			if (!this.customValidate && options.validateOne) {
				options.noValidation = true;
				validateResult = this.validateOne(this.schema[key], value);
				if (validateResult.isValid === false) {
					this.warn('Validate error in model.set', validateResult);
					if (options.silent !== true) {
						this.emit('validation.error', validateResult, newData);
					}
					return false;
				}
			}
		}
		else {
			this.warn('Data are incorrect in model.set()', arguments);
		}

		options = options || {};

		if (!this.customValidate && this.schema && options.noValidation !== true) {
			validateResult = this.validate(newData);
			if (validateResult !== null) {
				this.warn('Validate error in model.set', validateResult);
				if (options.silent !== true) {
					this.emit('validation.error', validateResult, newData);
				}
				return false;
			}
		}

		if (this.customValidate && options.noValidation !== true) {
			validateResult = this.customValidate(newData);
			this.log('Using a custom validation which returns:', validateResult);
			if (validateResult !== null) {
				this.warn('Validate error in model.set', validateResult);
				this.emit('validation.error', validateResult, newData);
				return false;
			}
		}

		this.properties = newData;
		if (options.silent !== true) {
			if (setAll) {
				if (typeof this.sync === 'function' && options.sync !== false) {
					this.sync('replace', newData);
				}

				this.emit('data.replace', newData, oldData);
			}
			else if (setItem){
				if (typeof this.sync === 'function' && options.sync !== false) {
					this.sync('item', key, value);
				}
				
				this.emit('data.item', key, value);
			}

			this.emit('data.change', newData, oldData);
		}

		return true;
	};

	/**
	 * Get one or all properties from a dataset
	 *
	 * @param  {String} key Data key
	 *
	 * @return {Object}     model dataset
	 */
	Model.prototype.get = function(key) {
		if (key === undefined) {
			return this.properties;
		}
		else {
			return XQCore.undotify(key, this.properties);
		}
	};

	/**
	 * Check wether model has a dataset
	 *
	 * @param {String} key Dataset key
	 * @return {Boolean} Returns true if model has a dataset with key
	 */
	Model.prototype.has = function(key) {
		return !!this.properties[key];
	};

	/**
	 * Remove all data from model
	 */
	Model.prototype.reset = function() {
		this.log('Reset model');
		this.properties = {};
		// this.removeAllListeners();
	};

	/**
	 * Append data to a subset
	 *
	 * @param {String} path path to subset
	 * @param {Object} data data to add
	 */
	Model.prototype.append = function(path, data, options) {
		var dataset = XQCore.undotify(path, this.properties);

		options = options || {};

		if (dataset instanceof Array) {
			dataset.push(data);
		}
		else if (typeof dataset === 'undefined') {
			XQCore.dedotify(this.properties, path, [data]);
		}
		else if (typeof dataset === 'object' && !path && XQCore.isEmptyObject(this.properties)) {
			this.properties = [data];
		}
		else {
			this.error('Model.append requires an array. Dataset isn\'t an array. Path: ', path);
			return;
		}

		if (options.silent !== true) {
			if (typeof this.sync === 'function' && options.sync !== false) {
				this.sync('append', path, data);
			}

			this.emit('data.append', path, data);
			this.emit('data.change', this.properties);
		}
	};

	/**
	 * Prepend data to a subset
	 *
	 * @param {String} path path to subset
	 * @param {Object} data data to add
	 */
	Model.prototype.prepend = function(path, data, options) {
		var dataset = XQCore.undotify(path, this.properties);

		options = options || {};

		if (dataset instanceof Array) {
			dataset.unshift(data);
		}
		else if (typeof dataset === 'undefined') {
			XQCore.dedotify(this.properties, path, [data]);
		}
		else if (typeof dataset === 'object' && !path && XQCore.isEmptyObject(this.properties)) {
			this.properties = [data];
		}
		else {
			this.error('Model.prepend requires an array. Dataset isn\'t an array. Path: ', path);
			return;
		}

		if (options.silent !== true) {
			if (typeof this.sync === 'function' && options.sync !== false) {
				this.sync('prepend', path, data);
			}

			this.emit('data.prepend', path, data);
			this.emit('data.change', this.properties);
		}
	};

	Model.prototype.insert = function(path, index, data, options) {
		var dataset = XQCore.undotify(path, this.properties);

		options = options || {};

		if (dataset instanceof Array) {
			dataset.splice(index, 0, data);
		}
		else if (typeof dataset === 'undefined') {
			XQCore.dedotify(this.properties, path, [data]);
		}
		else if (typeof dataset === 'object' && !path && XQCore.isEmptyObject(this.properties)) {
			this.properties = [data];
		}
		else {
			this.error('Model.insert requires an array. Dataset isn\'t an array. Path: ', path);
			return;
		}

		if (options.silent !== true) {
			if (typeof this.sync === 'function' && options.sync !== false) {
				this.sync('insert', path, 1, data);
			}

			this.emit('data.insert', path, index, data);
			this.emit('data.change', this.properties);
		}
	};

	/**
	 * Remove a subset
	 *
	 * @param {String} path path to subset
	 * @param {Number} index Index of the subsut to remove
	 * @param {Object} options Remove options
	 *
	 * @return {Object} removed subset
	 */
	Model.prototype.remove = function(path, index, options) {
		var dataset = XQCore.undotify(path, this.properties),
			removed = null;


		options = options || {};

		if (dataset instanceof Array) {
			removed = dataset.splice(index, 1);
		}
		else if (typeof dataset === 'object') {
			this.error('Model.remove requires an array. Dataset isn\'t an array. Path: ', path);
			return;
		}

		if (removed && options.silent !== true) {
			if (typeof this.sync === 'function' && options.sync !== false) {
				this.sync('remove', path, index);
			}

			this.emit('data.remove', path, index, removed[0]);
			this.emit('data.change', this.properties);
		}

		return removed;
	};

	/**
	 * Search an item in models properties
	 *
	 * @param {String} path Path to the parent property. We use dot notation to navigate to subproperties. (data.bla.blub) (Optional)
	 * @param {Object} searchfor Searching for object
	 * @return {Object} Returns the first matched item or null
	 */
	Model.prototype.search = function(path, searchfor) {
		var parent;

		if (arguments.length === 1) {
			searchfor = path;
			path = '';
			parent = this.properties;
		}
		else {
			parent = XQCore.undotify(path, this.properties);
		}

		if (parent) {
			for (var i = 0; i < parent.length; i++) {
				var prop = parent[i],
					matching;

				for (var p in searchfor) {
					if (searchfor.hasOwnProperty(p)) {
						if (prop[p] && prop[p] === searchfor[p]) {
							matching = true;
						}
						else {
							matching = false;
							break;
						}
					}
				}

				if (matching === true) {
					return prop;
				}

			}
		}

		return null;
	};

	/**
	 * Sort an array collection by a given attribute
	 *
	 * @param {String} path Path to the collection
	 * @param {Object} sortKeys Sort by key
	 *
	 * sortKeys: {
	 *   'key': 1 // Sort ascend by key,
	 *   'second.key': -1 // Sort descand by second.key
	 * }
	 *
	 * ascend, a -> z, 0 - > 9 (-1)
	 * descend, z -> a, 9 -> 0 (1)
	 * 
	 */
	Model.prototype.sortBy = function(path, sortKeys) {
		if (arguments.length === 1) {
			sortKeys = path;
			path = null;
		}

		var data = XQCore.undotify(path, this.properties),
			order;

		data.sort(function(a, b) {
			order = -1;
			for (var key in sortKeys) {
				if (sortKeys.hasOwnProperty(key)) {
					order = String(XQCore.undotify(key, a)).localeCompare(String(XQCore.undotify(key, b)));
					if (order === 0) {
						continue;
					}
					else if(sortKeys[key] === -1) {
						order = order > 0 ? -1 : 1;
					}

					break;
				}
			}

			return order;
		});

		this.set(path, data);
		return data;
	};

	/**
	 * Filter an array collection by a given filter function
	 *
	 * @param {String} path Path to the collection
	 * @param {String | Function} filter Filter function
	 *
	 */
	Model.prototype.filter = function(path, property, query, fn) {
		if (arguments.length === 1) {
			fn = path;
			path = null;
		}

		if (typeof fn === 'string') {
			if (this.__registeredFilter[fn]) {
				fn = this.__registeredFilter[fn];
			}
			else {
				throw new Error('Filter ' + fn + ' not registered!');
			}
		}

		//We use a for i instead of Array.filter because it's faster!
		var data = XQCore.undotify(path, this.__unfiltered.data || this.properties);
		var filtered = [];
		for (var i = 0, len = data.length; i < len; i++) {
			if (fn(property, query, data[i])) {
				filtered.push(data[i]);
			}
		}

		this.__unfiltered = {
			path: path,
			data: data
		};

		this.set(path, filtered);
		return filtered;
	};

	/**
	 * Resets a filter
	 * @method filterReset
	 * @param {Object} options Set options
	 */
	Model.prototype.filterReset = function(options) {
		if (this.__unfiltered) {
			this.set(this.__unfiltered.path, this.__unfiltered.data, options);
		}
	};

	Model.prototype.validate = function(data, schema) {
		var failed = [];
			
		schema = schema || this.schema;

		if (schema) {
			Object.keys(schema).forEach(function(key) {
				if (typeof data[key] === 'object' && typeof schema[key].type === 'undefined') {
					var subFailed = this.validate(XQCore.extend({}, data[key]), XQCore.extend({}, schema[key]));
					if (Array.isArray(subFailed) && subFailed.length > 0) {
						failed = failed.concat(subFailed);
					}
					return;
				}
				
				var validationResult = this.validateOne(schema[key], data[key]);

				if (validationResult.isValid === true) {
					data[key] = validationResult.value;
				}
				else {
					validationResult.error.property = key;
					failed.push(validationResult.error);
				}
			}.bind(this));
		}

		if (failed.length === 0) {
			this._isValid = true;
			return null;
		}
		else {
			this._isValid = false;
			return failed;
		}
	};

	/**
	 * Validate one property
	 *
	 * ValidatorResultItemObject
	 * {
	 *   isValid: Boolean,
	 *   value: Any,
	 *   error: Object
	 * }
	 *
	 * @param  {Any} schema Schema for the check
	 * @param  {Any} value Property value
	 *
	 * @return {Object}       Returns a ValidatorResultItemObject
	 */
	Model.prototype.validateOne = function(schema, value) {
		var failed = null,
			schemaType = typeof schema.type === 'function' ? typeof schema.type() : schema.type.toLowerCase();

		if (value === '' && schema.noEmpty === true) {
			value = undefined;
		}

		if ((value === undefined || value === null) && schema.default) {
			value = schema.default;
		}

		if ((value === undefined || value === null || value === '')) {
			if (schema.required === true) {
				failed = {
					msg: 'Property is undefined or null, but it\'s required',
					errCode: 10
				};
			}
		}
		else if (schemaType === 'string') {
			if (schema.convert && typeof(value) === 'number') {
				value = String(value);
			}

			if (schemaType !== typeof(value)) {
				failed = {
					msg: 'Property type is a ' + typeof(value) + ', but a string is required',
					errCode: 11
				};
			}
			else if(schema.min && schema.min > value.length) {
				failed = {
					msg: 'String length is too short',
					errCode: 12
				};
			}
			else if(schema.max && schema.max < value.length) {
				failed = {
					msg: 'String length is too long',
					errCode: 13
				};
			}
			else if(schema.match && !schema.match.test(value)) {
				failed = {
					msg: 'String doesn\'t match regexp',
					errCode: 14
				};
			}

		}
		else if(schemaType === 'number') {
			if (schema.convert && typeof(value) === 'string') {
				value = parseInt(value, 10);
			}

			if (schemaType !== typeof(value)) {
				failed = {
					msg: 'Property type is a ' + typeof(value) + ', but a number is required',
					errCode: 21
				};
			}
			else if(schema.min && schema.min > value) {
				failed = {
					msg: 'Number is too low',
					errCode: 22
				};
			}
			else if(schema.max && schema.max < value) {
				failed = {
					msg: 'Number is too high',
					errCode: 23
				};
			}
		}
		else if(schemaType === 'date') {
			if (value) {
				var date = Date.parse(value);
				if (isNaN(date)) {
					failed = {
						msg: 'Property isn\'t a valid date',
						errCode: 31
					};
				}
			}
		}
		else if(schemaType === 'array') {
			if (!Array.isArray(value)) {
				failed = {
					msg: 'Property type is a ' + typeof(value) + ', but an array is required',
					errCode: 41
				};
			}
			else if(schema.min && schema.min > value.length) {
				failed = {
					msg: 'Array length is ' + value.length + ' but must be greater than ' + schema.min,
					errCode: 42
				};
			}
			else if(schema.max && schema.max < value.length) {
				failed = {
					msg: 'Array length is ' + value.length + ' but must be lesser than ' + schema.max,
					errCode: 43
				};
			}
		}
		else if(schemaType === 'object') {
			if (typeof(value) !== 'object') {
				failed = {
					msg: 'Property isn\'t a valid object',
					errCode: 51
				};
			}
		}
		else if(schemaType === 'objectid') {
			if (!/^[a-zA-Z0-9]{24}$/.test(value)) {
				failed = {
					msg: 'Property isn\'t a valid objectId',
					errCode: 52
				};
			}
		}
		else if(schemaType === 'boolean') {
			if (typeof(value) !== 'boolean') {
				failed = {
					msg: 'Property isn\'t a valid boolean',
					errCode: 61
				};
			}
		}

		if (failed === null) {
			failed = {
				isValid: true,
				value: value,
				error: null
			};
		}
		else {
			this.warn('Validation error on property', failed, 'Data:', value);
			failed = {
				isValid: false,
				value: value,
				error: failed
			};
		}

		return failed;
	};

	Model.prototype.isValid = function() {
		return this._isValid;
	};

	Model.prototype.setData = function(data, caller) {
		return this.set(data, {
			extend: true
		});
	};

	/**
	 * Register a filter function 
	 *
	 * XQCore.Model.registerFilter('myfilter', fn);
	 * Registers a filter for all models
	 *
	 * instance.registerFilter('myfilter', fn);
	 * Registers a filter for the instance only.
	 * 
	 * @method registerFilter
	 * @param {String} filterName [description]
	 * @param {Function} filterFunction [description]
	 */
	Model.registerFilter = function(filterName, filterFunction) {
		if (typeof filterFunction !== 'function') {
			throw new Error('Filter function isn\'t a function');
		}

		var obj = typeof this === 'function' ? Model.prototype : this;
		obj.__registeredFilter[filterName] = filterFunction;
	};

	Model.prototype.registerFilter = Model.registerFilter;

	Model.prototype.__registeredFilter = {
		quicksearch: function(property, query, item) {
			// console.log('Filter item:', property, query, item);
			var value = XQCore.undotify(property, item);
			var pat = new RegExp(query.replace(/[a-z0-9äüöß]/g, '$&.*'), 'i');
			// console.log('Pat:', pat.source);
			return pat.test(value);
		}
	};

	XQCore.Model = Model;
})(XQCore);
