/*!
 * XQCore - 0.4.18
 * 
 * Model View Presenter Javascript Framework
 *
 * XQCore is licenced under MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Copyright (c) 2012 - 2013 Noname Media, http://noname-media.com
 * Author Andi Heinkelein
 *
 * Creation Date: 2013-12-02
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('xqcore', ['jquery', 'handlebars'], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'), require('handlebars'));
    } else {
        root.XQCore = factory(root.jQuery, root.Handlebars);
    }
}(this, function (jQuery, Handlebars) {


/*jshint evil:true */
/*global XQCore:true */

/**
 * XQCore main object
 *
 * @package XQcore
 * @type {Object}
 */
var XQCore = {
	version: '0.4.18',
	defaultRoute: 'default',
	html5Routes: false,
	hashBang: '#!',
	callerEvent: 'callerEvent'
};


//XQCore helper functions
XQCore.extend = jQuery.extend;

XQCore._dump = {};
XQCore.dump = function(componentName) {
	if (XQCore._dump[componentName]) {
		console.log('[XQCore dump]', componentName, XQCore._dump[componentName]);
		return XQCore._dump[componentName];
	}

	return false;
};
/**
 * XQCore EventEmitter
 *
 * Based on EventEmitter v4.2.5 by Oliver Caldwell
 * http://git.io/ee
 *
 */
XQCore.Event = (function() {
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

	return EventEmitter;

})();

/**
 * XQCore Logger
 *
 * Based on EventEmitter.js
 * 
 * 
 */
XQCore.Logger = (function(conf) {
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
	var logger = function() {
		
	};

	/**
	 * Loggs a message to the console
	 *
	 * @method log
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
	 * @method warn
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
	 * @method error
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
	 * @method timer
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

	logger.prototype.__scope = {
		getHumanTime: getHumanTime
	};
	

	return logger;
})();
/**
 * XQCore.GetSet
 *
 * @module XQCore.GetSet
 * @requires XQCore.Logger
 * @requires XQCore.Event
 */
XQCore.GetSet = (function(undefined) {
	'use strict';

	/**
	 * GetSet constructor
	 *
	 * @constructor
	 * @class GetSet
	 * @param {Object} conf COnfig object
	 */
	var getset = function(conf) {
		this.properties = {};
		this._isValid = false;

		if (conf) {
			this.schema = conf.schema;
			this.debug = Boolean(conf.debug);
		}

		this.name = 'GetSet';

		XQCore.extend(this, new XQCore.Event());
	};

	var undotify = function(path, obj) {
		if(path) {
			path = path.split('.');
			path.forEach(function(key) {
				obj = obj[key];
			});
		}

		return obj;
	};

	XQCore.extend(getset.prototype, new XQCore.Logger());

	/**
	 * Set getset data
	 *
	 * Triggers a data.change event if data was set succesfully
	 *
	 * @method set
	 * @param {Object} data
	 */
	
	/**
	 * Set getset data
	 *
	 * Triggers these events if data was set succesfully<br>
	 * data.change<br>
	 * &lt;key&gt;.change
	 *
	 * @method set
	 * @param {String} key
	 * @param {Object} value Data value
	 */
	getset.prototype.set = function() {
		var newData = {},
			oldData = this.get(),
			validateResult,
			key;

		if (arguments[0] === null) {
			newData = arguments[1];
			this.log('Set data', newData, oldData);
		}
		else if (typeof arguments[0] === 'object') {
			//Add a dataset
			newData = arguments[0];
			this.log('Set data', newData, oldData);
		}
		else if (typeof arguments[0] === 'string') {
			newData = this.get();
			key = arguments[0];
			var val = arguments[1];

			newData[key] = val;
			this.log('Set data', newData, oldData);
		}
		else {
			this.warn('Data are incorrect in getset.set()', arguments);
		}

		if (this.schema) {
			validateResult = this.validate(newData);
			if (validateResult !== null) {
				this.warn('Validate error in getset.set', validateResult);
				this.emit('validation.error', validateResult);
				return false;
			}
		}

		if (this.customValidate) {
			validateResult = this.customValidate(newData);
			if (validateResult !== null) {
				this.warn('Validate error in getset.set', validateResult);
				this.emit('validation.error', validateResult);
				return false;
			}
		}

		this.properties = newData;
		this.emit('data.change', newData, oldData);

		if (key) {
			this.emit('change.' + key, newData[key]);
		}

		return true;
	};

	/**
	 * Get one or all properties from a dataset
	 *
	 * @param  {String} key Data key
	 *
	 * @return {Object}     getset dataset
	 */
	getset.prototype.get = function(key) {
		if (key === undefined) {
			return this.properties;
		}
		else {
			return this.properties[key];
		}
	};

	/**
	 * Check wether getset has a dataset
	 *
	 * @param {String} key Dataset key
	 * @return {Boolean} Returns true if getset has a dataset with key
	 */
	getset.prototype.has = function(key) {
		return !!this.properties[key];
	};

	/**
	 * Remove all data from getset
	 */
	getset.prototype.reset = function() {
		this.log('Reset getset');
		this.properties = {};
		this.removeAllListener();
	};

	/**
	 * Append data to a subset
	 *
	 * @param {String} path path to subset
	 * @param {Object} data data to add
	 */
	getset.prototype.append = function(path, data) {
		if (arguments.length === 1) {
			data = path;
			path = null;
		}

		var dataset = this.properties,
			oldDataset = this.get(),
			trigger = true;

		if (path) {
			path.split('.').forEach(function(key) {
				dataset = dataset[key];
			});
		}

		if (dataset instanceof Array) {
			dataset.push(data);
		}
		else {
			if (path === null) {
				this.properties = [data];
				dataset = this.get();
			}
			else {
				this.warn('GetSet.append requires an array. Dataset isn\'t an array', path);
			}
		}

		if (trigger) {
			this.emit('data.change', dataset, oldDataset);
		}

		return data;
	};

	/**
	 * Prepend data to a subset
	 *
	 * @param {String} path path to subset
	 * @param {Object} data data to add
	 */
	getset.prototype.prepend = function(path, data) {
		if (arguments.length === 1) {
			data = path;
			path = null;
		}

		var dataset = this.properties,
			oldDataset = this.get(),
			trigger = true;

		if (path) {
			path.split('.').forEach(function(key) {
				dataset = dataset[key];
			});
		}

		if (dataset instanceof Array) {
			dataset.unshift(data);
		}
		else {
			if (path === null) {
				this.properties = [data];
				dataset = this.get();
			}
			else {
				this.warn('GetSet.append requires an array. Dataset isn\'t an array', path);
			}
		}

		if (trigger) {
			this.emit('data.change', dataset, oldDataset);
		}

		return data;
	};

	/**
	 * Remove a subset
	 *
	 * @param {String} path path to subset
	 * @param {Number} index Index of the subsut to remove
	 *
	 * @return {Object} removed subset
	 */
	getset.prototype.remove = function(path, index) {
		var dataset = this.properties,
			data = null;
		path.split('.').forEach(function(key) {
			dataset = dataset[key];
		});

		if (dataset instanceof Array) {
			data = dataset.splice(index, 1);
			data = data[0] || null;
		}
		else {
			this.warn('getset.remove() doesn\'t work with Objects in getset', this.name);
		}

		return data;
	};

	/**
	 * Search a item in models properties
	 *
	 * @param {String} path to the parent property. We use dot notation to navigate to subproperties. (data.bla.blub)
	 * @param {Object} searchfor Searching for object
	 * @return {Object} Returns the first matched item or null
	 */
	getset.prototype.search = function(path, searchfor) {
		var parent = undotify(path, this.properties);

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
	getset.prototype.sortBy = function(path, sortKeys) {
		if (arguments.length === 1) {
			sortKeys = path;
			path = null;
		}

		var data = undotify(path, this.properties),
			order;

		data.sort(function(a, b) {
			order = -1;
			for (var key in sortKeys) {
				if (sortKeys.hasOwnProperty(key)) {
					order = String(undotify(key, a)).localeCompare(String(undotify(key, b)));
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

	getset.prototype.validate = function(data, schema) {
		var failed = [];
			
		schema = schema || this.schema;

		if (schema) {
			Object.keys(schema).forEach(function(key) {
				console.log('KEY:', key, typeof data[key], typeof schema[key].type);
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
	getset.prototype.validateOne = function(schema, value) {
		console.log('SCHEMA:', schema);
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

	getset.prototype.isValid = function() {
		return this._isValid;
	};


	//From passboxItemModel

	/**
	 * Returns the last validation result
	 *
	 * @method  getLastValidationError
	 * @returns {Object} Returns the validation error or null
	 */
	/*model.getLastValidationError = function() {
		this.__lastValidationError = null;
		this.on('validation.error', function(validationError) {
			this.__lastValidationError = validationError;
		}.bind(this));

		return this.__lastValidationError;	
	};*/


	return getset;
})();
/**
 * XQCore Presenter
 *
 * @module XQCore Presenter
 */
XQCore.Presenter = (function(undefined) {
	'use strict';

	/**
	 * XQCore.Presenter base class
	 *
	 * @class XQCore.Presenter
	 * @constructor
	 *
	 * @extends XQCore.Logger
	 * @extends XQCore.Event
	 *
	 * @param  {Object} conf Presenter extend object
	 */
	var presenter = function(conf) {
		this.root = '/';
		this.debug = false;
		this.routes = [];
		
		conf = conf || {};

		this.customInit = conf.init;
		this.conf = conf;
		delete conf.init;

		XQCore.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
		this.name = (conf.name || 'Nameless') + 'Presenter';
		this.eventCallbacks = {};

		/**
		 * Points to the last shown view
		 *
		 * @property {Object} lastShownView Points to the last shown view
		 */
		this.lastShownView = null;

		this.registeredViews = [];
		this.registeredModels = [];
		this.fireViewInit = function(view) {
			var allReady = true;
			this.registeredViews.forEach(function(item) {
				if (view === item.view) {
					item.isReady = true;
				}

				if (item.isReady === false) {
					allReady = false;
				}
			});

			this.viewInit(view);

			if (allReady === true) {
				this.emit('views.ready');
			}
		};

		this.registerView = function(view) {
			var i;
			if (view instanceof Array) {
				for (i = 0; i < view.length; i++) {
					this.registeredViews.push({
						view: view[i],
						isReady: false
					});
				}
			}
			else {
				this.registeredViews.push({
					view: view,
					isReady: false
				});
			}
		};

		this.registerModel = function(model) {
			var i;
			if (model instanceof Array) {
				for (i = 0; i < model.length; i++) {
					this.registeredModels.push({
						model: model[i],
						isReady: false
					});
				}
			}
			else {
				this.registeredModels.push({
					model: model,
					isReady: false
				});
			}
		};

		
	};

	/**
	 * Listen View events
	 * @property {Array} events Observed view events
	 */
	presenter.prototype.events = {};

	presenter.prototype.init = function(views) {
		var i,
			self = this,
			conf = this.conf;

		//Setup popstate listener
		if (conf.routes) {
			this.Router = new XQCore.Router();

			//Add routes
			Object.keys(conf.routes).forEach(function(route) {
				var callback = this.routes[route];
				if (typeof callback === 'string') {
					callback = this[callback];
				}

				if (typeof callback === 'function') {
					this.Router.addRoute(route, callback);
				}
				else {
					this.warn('Router callback isn\'t a function', callback, 'of route', route);
				}
			}.bind(this));

			window.addEventListener('popstate', function(e) {
				self.__onPopstate(e.state);
			}, false);

			this.on('views.ready',function() {
				var route = XQCore.defaultRoute;
				if (/^#![a-zA-Z0-9]+/.test(self.getHash())) {
					route = self.getHash().substr(2);
				}

				route = self.Router.match(route);
				if (route) {
					var data = route.params;
					if (XQCore.callerEvent) {
						data[XQCore.callerEvent] = 'pageload';
					}

					self.log('Trigger route', route, data);

					route.fn.call(self, route.params);
				}
			});
		}

		// custom init
		if (typeof this.customInit === 'function') {
			this.customInit.call(this);
		}

		//Initialize views
		console.log('views', views);
		if (views instanceof Array) {
			for (i = 0; i < views.length; i++) {
				this.registerView(views[i]);
			}
		}
		else if (views) {
			this.registerView(views);
		}

		this.registeredViews.forEach(function(view) {
			view.view.init(self);
		});

		this.registeredModels.forEach(function(model) {
			model.model.init(self);
		});
	};

	/**
	 * Calling on view init
	 *
	 * @param {object} view The initializing view
	 */
	presenter.prototype.viewInit = function(view) {

	};

	/**
	 * Add a history item to the browser history
	 *
	 * @param {Object} data Data object
	 * @param {String} url Page URL (Optional) defaults to the curent URL
	 */
	presenter.prototype.pushState = function(data, url) {
		/*this.log('Check State', data, history.state, XQCore.compare(data, history.state));
		if (XQCore.compare(data, history.state)) {
			this.warn('Abborting history.pushState because data are equale to current history state');
		}*/
		var hash = XQCore.html5Routes || url.charAt(0) === '/' ? '' : XQCore.hashBang;
		url = hash + url;
		history.pushState(data, '', url || null);
		this.log('Update history with pushState', data, url);
	};

	/**
	 * Add a history item to the browser history
	 *
	 * @param {Object} data Data object
	 * @param {String} url Page URL (Optional) defaults to the current URL
	 */
	presenter.prototype.replaceState = function(data, url) {
		/*if (data === history.state) {
			this.warn('Abborting history.replaceState because data are equale to current history state');
		}*/
		var hash = XQCore.html5Routes || url.charAt(0) === '/' ? '' : XQCore.hashBang;
		url = hash + url;
		history.replaceState(data, '', url || null);
		this.log('Update history with replaceState', data, url);
	};

	/**
	 * Navigates to a given route
	 *
	 * @param {String} route Route url
	 * @param {Object} data Data object
	 * @param {Boolean} replace Replace current history entry with route
	 */
	presenter.prototype.navigateTo = function(route, data, replace) {
		this.log('Navigate to route: ', route, data, replace);
		if (replace) {
			this.replaceState(data, route);
		} else {
			this.pushState(data, route);
		}

		this.__onPopstate(data);
	};

	/**
	 * Gets a view by it's name
	 *
	 * @method getView
	 * @param {String} viewName Required view name
	 * @return {Object} Returns view object or null if no view was found
	 */
	presenter.prototype.getView = function(viewName) {
		var i, view;

		for (i = 0; i < this.registeredViews.length; i++) {
			view = this.registeredViews[i].view;
			if (view.name === viewName) {
				return view;
			}
		}

		return null;
	};


	/**
	 * Show a view if it's not visible and update the history state
	 *
	 * @method showView
	 *
	 * @param  {String} viewName The name of the view
	 * @param  {Object} data Data it's neede to showing the view
	 *
	 */
	presenter.prototype.showView = function(viewName, data) {
		var view = this.getView(viewName + 'View');
		if (!view) {
			this.warn('View not defined!', viewName);
			return;
		}

		this.log('Show view:', viewName, data);
		this.log('Hide view:', this.lastShownView);

		if (this.lastShownView !== view) {
			if (this.lastShownView && typeof this.lastShownView.hide === 'function') {
				this.lastShownView.hide();
				view.show();
			}
			else {
				view.show(true);
			}
		}
	};

	/**
	 * Returns the current hash
	 *
	 * @method getHash
	 * @returns {String} Returns the current value from location.hash
	 */
	presenter.prototype.getHash = function() {
		return location.hash;
	};

	/**
	 * Returns the current pathname
	 *
	 * @method getPathname
	 * @returns {String} Returns the current value from location.pathname
	 */
	presenter.prototype.getPathname = function() {
		return location.pathname;
	};

	/**
	 * Couple a model with a view
	 *
	 * @method couple
	 * @chainable
	 * @param {Object} conf Configuration object
	 *
	 * conf: {
	 *   model: String modelname
	 *   view: String viewname
	 *   route String routename
	 * }
	 */
	presenter.prototype.couple = function(conf) {
		var view = conf.view,
			model = conf.model;

		if (!view instanceof XQCore.View) {
			this.error('Can\'t couple view with model! View isn\'t a XQCore.View');
			return;
		}

		if (!model instanceof XQCore.Model) {
			this.error('Can\'t couple model with model! Model isn\'t a XQCore.Model');
			return;
		}

		model.on('data.change', function(data) {
			view.render(data);
		});

		return this;
	};


	/**
	 * PopstateEvent
	 *
	 * @method __onPopstate
	 * @param {Object} data Event data
	 * @private
	 */
	presenter.prototype.__onPopstate = function(data) {
		var self = this;

		self.log('popstate event recived', data);

		var route = XQCore.defaultRoute;
		if (XQCore.html5Routes) {
			var pattern = new RegExp('^' + self.root);
			route = self.getPathname().replace(pattern, '');
		}
		else {
			if (/^#![a-zA-Z0-9]+/.test(this.getHash())) {
				route = self.getHash().substr(2);
			}
		}

		route = self.Router.match(route);
		if (route) {
			data = data || route.params;
			if (XQCore.callerEvent) {
				data[XQCore.callerEvent] = 'popstate';
			}

			self.log('Trigger route', route, data);

			route.fn.call(self, data);
		}
	};

	return presenter;
})();

XQCore.Model = (function(window, document, $, undefined) {
	var model;

	var undotify = function(path, obj) {
		if(path) {
			path = path.split('.');
			path.forEach(function(key) {
				obj = obj[key];
			});
		}

		return obj;
	};

	model = function(conf) {
		if (conf === undefined) {
			conf = {};
		}

		this.customInit = conf.init;
		delete conf.init;

		this.customValidate = conf.validate;
		delete conf.validate;

		this.conf = conf;

		$.extend(this, conf, new XQCore.Logger());
		$.extend(this, new XQCore.Event());
		this.name = (conf.name || 'Nameless') + 'Model';
		this.debug = Boolean(conf.debug);
		// this._isValid = false;
		this.properties = {};

		//Add default values
		if (this.defaults && !$.isEmptyObject(this.defaults)) {
			this.set(this.defaults);
		}
	};

	$.extend(model.prototype, new XQCore.GetSet());

	model.prototype.init = function() {

		if (this.debug) {
			XQCore._dump[this.name] = this;
		}

		// custom init
		if (typeof this.customInit === 'function') {
			this.customInit.call(this);
		}
	};

	/**
	 * Called on before sending an ajax request
	 * You can use this function to manipulate all data they be send to the server
	 *
	 * @param {Object} data The data to send to the server
	 * @return {Object} data
	 */
	model.prototype.onSend = function(data) {
		return data;
	};

	/**
	 * Send an ajax request to the webserver.
	 *
	 * You must set the server URI first with model.server = 'http://example.com/post'
	 *
	 * @param {String} Method send method, GET, POST, PUT, DELETE (default POST)
	 * @param {String} url Server URL (optional, then model.server must be set)
	 * @param {Object} data The data to sent to the server
	 * @param {Function} callback Calls callback(err, data, status, jqXHR) if response was receiving
	 */
	model.prototype.send = function(method, url, data, callback) {

		if (typeof url === 'object') {
			callback = data;
			data = url;
			url = this.server;
			method = method;
		}
		else if (typeof data === 'function') {
			callback = data;
			data = this.get();
		}
		else if (data === undefined) {
			data = this.get();
		}

		if (method === undefined) {
			method = 'POST';
		}

		if (!url) {
			url = this.server;
		}

		//Handle onSend
		if (typeof this.onSend === 'function') {
			data = this.onSend.call(this, data);
		}

		this.log('Sending an ajax call to ', this.server, 'with data: ', data);

		$.ajax({
			url: url,
			type: method,
			data: data,
			dataType: 'json',
			success: function(data, status, jqXHR) {
				if (typeof callback === 'function') {
					callback.call(this, null, data, status, jqXHR);
				}
			}.bind(this),
			error: function(jqXHR, status, error) {
				if (typeof callback === 'function') {
					callback.call(this, {
						type: status,
						http: error
					}, null, status, jqXHR);
				}
			}.bind(this)
		});
	};

	/**
	 * Sends a POST to the Datastore
	 *
	 * @param {String} url Server URL (optional, then model.server must be set)
	 * @param  {Object}   data     Dato to sending
	 * @param  {Function} callback Calling on response
	 *
	 * callback: void function(err, data, status, jqXHR)
	 *
	 */
	model.prototype.sendPOST = function(url, data, callback) {
		this.send('POST', url, data, callback);
	};

	/**
	 * Sends a GET to the Datastore
	 *
	 * @param {String} url Server URL (optional, then model.server must be set)
	 * @param  {Object}   data     Dato to sending
	 * @param  {Function} callback Calling on response
	 *
	 * callback: void function(err, data, status, jqXHR)
	 *
	 */
	model.prototype.sendGET = function(url, data, callback) {
		this.send('GET', url, data, callback);
	};

	/**
	 * Sends a PUT to the Datastore
	 *
	 * @param {String} url Server URL (optional, then model.server must be set)
	 * @param  {Object}   data     Dato to sending
	 * @param  {Function} callback Calling on response
	 *
	 * callback: void function(err, data, status, jqXHR)
	 *
	 */
	model.prototype.sendPUT = function(url, data, callback) {
		this.send('PUT', url, data, callback);
	};

	/**
	 * Sends a DELETE to the Datastore
	 *
	 * @param {String} url Server URL (optional, then model.server must be set)
	 * @param  {Object}   data     Dato to sending
	 * @param  {Function} callback Calling on response
	 *
	 * callback: void function(err, data, status, jqXHR)
	 *
	 */
	model.prototype.sendDELETE = function(url, data, callback) {
		this.send('DELETE', url, data, callback);
	};

	/**
	 * Check if model is ready and call func or wait for ready state
	 */
	model.prototype.ready = function(func) {
		if (func === true) {
			//Call ready funcs
			if (Array.isArray(this.__callbacksOnReady)) {
				this.log('Trigger ready state');
				this.__callbacksOnReady.forEach(function(func) {
					func.call(this);
				}.bind(this));
			}

			this.__isReady = true;
			delete this.__callbacksOnReady;
		}
		else if (typeof func === 'function') {
			if (this.__isReady === true) {
				func();
			}
			else {
				if (!this.__callbacksOnReady) {
					this.__callbacksOnReady = [];
				}
				this.__callbacksOnReady.push(func);
			}
		}
		else {
			this.warn('arg0 isn\'t a callback in model.ready()!');
		}
	};

	/**
	 * Fetch data from server
	 *
	 * @param {Object} query MongoDB query 
	 * @param {Function} callback Callback function
	 */
	model.prototype.fetch = function(query, callback) {
		this.sendGET(query, callback);
	};

	/**
	 * Load bugs
	 *
	 * @param {Object} query Datastore query parameter
	 * @param {Function} callback Callback function
	 */
	model.fetch = function(query) {
		this.sendGET(query, function(err, data) {
			if (err) {
				console.error(err);
			}

			data = this.prepare(data);
			this.set(data);
		}.bind(this));
	};

	return model;
})(window, document, jQuery);

/*global $:false */
/**
 * XQCore View module
 *
 * @module XQCore.View
 * @returns {object} Returns a XQCore.View prototype object
 */
XQCore.View = (function(undefined) {
	'use strict';

	/**
	 * XQCore.View
	 *
	 * @constructor
	 * @class XQCore.View
	 * @param {object} conf View configuration
	 */
	var view = function(conf) {

		/**
		 * Determines wether the view is hidden after rendering
		 * @property hidden
		 * @type Boolean
		 * @default false
		 */
		
		/**
		 * Sets the container element
		 * @property el
		 * @type Selector
		 * @default "body"
		 */

		if (arguments.length === 2) {
			this.presenter = arguments[0];
			conf = arguments[1];
			console.warn('Defining View with presenter is deprecated.');
		}

		conf = conf || {
			events: null
		};

		this.customInit = conf.init;
		this.conf = conf;
		delete conf.init;

		XQCore.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
		this.name = (conf.name || 'Nameless') + 'View';

		this.debug = Boolean(conf.debug);
	};

	/**
	 * Init function
	 *
	 * @method init
	 *
	 * @param  {Object} presenter Views presenter object
	 */
	view.prototype.init = function(presenter) {
		var self = this,
			conf = this.conf;

		//If old style
		if (!presenter) {
			presenter = this.presenter;
			presenter.registerView(this);
		}

		//Register view at presenter
		this.presenter = presenter;

		$(function() {
			this.container = $(conf.container);
			if (conf.tag) {
				this.$el = $($.parseHTML('<' + conf.tag + '/>'));
				this.$el.appendTo(this.container);
			}
			else {
				this.$el = this.container;
			}
			this.el = this.$el.get(0);

			if (conf.hidden === true) {
				this.$el.hide();
			}

			if (conf.id) {
				this.$el.attr('id', conf.id);
			}

			if (conf.className) {
				this.$el.addClass(conf.className);
			}

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
						var spacePos = key.indexOf(' '),
							eventFunc = this.events[key],
							eventName = key.substr(0, spacePos),
							selector = key.substr(spacePos + 1) || this.container,
							self = this,
							eventDest;

						if (typeof eventFunc === 'function') {
							eventDest = this;
						}
						else if (eventFunc.indexOf('view:') === 0) {
							eventFunc = this[eventFunc.substr(5)];
							eventDest = this;
						}
						else {
							eventFunc = this.presenter.events[this.events[key]];
							if (typeof eventFunc === 'string') {
								eventFunc = this.presenter[this.events[key]];
							}
							eventDest = this.presenter;
						}

						if (eventFunc && eventName) {

							if (typeof eventFunc === 'function') {
								//Register event listener
								this.container.delegate(selector, eventName, function(e) {
									var formData = null,
										tagData = null;

									if (e.type === 'submit') {
										formData = XQCore.Util.serializeForm(e.currentTarget);
									}
									else if (e.type === 'keydown' || e.type === 'keyup' || e.type === 'keypress') {
										formData = $(e.currentTarget).val();
									}

									tagData = $.extend($(e.currentTarget).data(), {
										itemIndex: getItemIndex.call(self, e.currentTarget)
									});

									eventFunc.call(eventDest, e, tagData, formData);
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
				}

				// custom init
				if (typeof this.customInit === 'function') {
					this.customInit.call(this);
				}

				//Call presenter.initView()
				this.presenter.fireViewInit(this);
			}
			else {
				this.error('Can\'t initialize View, Container not found!', this.container);
			}
		}.bind(this));
	};

	view.prototype.show = function() {
		this.$el.show();
	};

	view.prototype.hide = function() {
		this.$el.hide();
	};

	/**
	 * Render view
	 *
	 * @method render
	 * @emits content.change
	 *
	 * @param  {Object} data Render data
	 *
	 */
	view.prototype.render = function(data) {
		this.log('Render view template', this.template, 'with data:', data);
		var template = typeof this.template === 'function' ? this.template : Handlebars.compile(this.template);
		this.$el.html(template(data || {}));

		this.emit('content.change', data);
	};

	view.prototype.renderHTML = function(template, data) {
		this.log('Render view html snipet', template, 'with data:', data);
		template = typeof template === 'function' ? template : Handlebars.compile(template);
		return template(data);
	};

	view.prototype.resize = function() {

	};

	/**
	 * Appends a html fragment to a html element
	 * You must set the itemTemplate and subSelector  option first
	 *
	 * @param {String} selector parent selector
	 * @param {Object} data item data
	 * @param {Object} options Appending options (not implemented yet)
	 */
	view.prototype.append = function(data, options) {
		this.manipulate('append', data, options);
	};

	/**
	 * Prepends a html fragment to a html element
	 * You must set the itemTemplate and subSelector option first
	 *
	 * @param {Object} data item data
	 * @param {Object} options Prepending options (not implemented yet)
	 */
	view.prototype.prepend = function(data, options) {
		this.manipulate('prepend', data, options);
	};

	/**
	 * Remove a item from a dom node
	 *
	 * @param {Number} index Remove item <index> from a node list
	 */
	view.prototype.remove = function(index) {
		this.manipulate('remove', index);
	};

	/**
	 * Manipulates a dom node
	 *
	 * @param  {String} action  Manipulation method
	 * @param  {[type]} data    [description]
	 * @param  {[type]} options (not implemented yet)
	 *
	 * @return {[type]}         [description]
	 */
	view.prototype.manipulate = function(action, data, options) {
		if (this.subSelector === undefined) {
			this.warn('You must set the subSelector option');
			return false;
		}

		if (this.itemTemplate === undefined) {
			this.warn('You must set the itemTemplate option');
			return false;
		}

		var selector = $(this.subSelector, this.container),
			html;

		switch (action) {
			case 'append':
				html = Handlebars.compile(this.itemTemplate)(data);
				$(html).appendTo(selector);
				break;
			case 'prepend':
				html = Handlebars.compile(this.itemTemplate)(data);
				$(html).prependTo(selector);
				break;
			case 'remove':
				selector.children().eq(data).remove();
				break;
			default:
				this.error('undefined action in view.manipulate()', action);
		}

	};

	/**
	 * Gets the data of an element
	 *
	 * @param {Object} selector DOM el or a jQuery selector of the element
	 *
	 * @return {Object} Returns the data of an element or null
	 */
	view.prototype.getElementData = function(selector) {
		var el = $(selector, this.container);
		if (el.length) {
			var data = {},
				attrs = el.get(0).attributes,
				i;

			for (i = 0; i < attrs.length; i++) {
				if (attrs[i].name.indexOf('data-') === 0) {
					var name = attrs[i].name.substr(5),
						value = attrs[i].value;

					if (typeof value === 'string') {
						try {
							if (value === 'true' || value === 'TRUE') {
								value = true;
							}
							else if (value === 'false' || value === 'FALSE') {
								value = false;
							}
							else if (value === 'null' || value === 'NULL') {
								value = null;
							}
							else if (value === 'undefined') {
								value = undefined;
							}
							else if (+value + '' === value) {
								value = +value;
							}
							else {
								value = JSON.parse(value);
							}
						}
						catch(err) {

						}
					}

					data[name] = value;
				}
			}

			return data;
		}
		else {
			return null;
		}
	};

	/**
	 * Triggers a view event to the presenter
	 *
	 * @method triggerEvent
	 *
	 * @param {String} eventName Event of the triggered event
	 * @param {Object} e EventObject
	 * @param {Object} tag Tag data
	 * @param {Object} data Event data
	 */
	view.prototype.triggerEvent = function(eventName, e, tag, data) {
		this.presenter.events[eventName].call(this.presenter, e, tag, data);
	};

	/**
	 * Navigate to a given route
	 *
	 * @method navigateTo
	 *
	 * @param {String} route Route url
	 * @param {Object} data Data object
	 * @param {Boolean} replace Replace current history entry with route
	 */
	view.prototype.navigateTo = function(route, data, replace) {
		this.presenter.navigateTo(route, data, replace);
	};

	/**
	 * Gets the index of a subSelector item
	 * This function must binded to the view
	 *
	 * @param  {Object} el Start element.
	 *
	 * @return {Number}    index of the element or null
	 */
	var getItemIndex = function(el) {
		var index = null,
			container = $(this.container).get(0),
			curEl = $(el),
			nextEl = curEl.parent(),
			subSelector = $(this.subSelector).get(0),
			d = 0;

		if (this.subSelector) {
			do {
				if (nextEl.get(0) === subSelector) {
					return $(curEl).index();
				}
				curEl = curEl.parent();
				nextEl = curEl.parent();

				if (++d > 100) {
					console.error('Break loop!');
					break;
				}
			} while(curEl.length && curEl.get(0) !== container);
		}

		return index;
	};



	return view;
})();

/*global jQuery:false */
/**
 * A bunch of helpfull functions
 *
 * @return {Object} Returns a singelton object instance of XQCore.Util
 */
XQCore.Util = (function($) {
	'use strict';

	var util = {
		name: 'XQCore.Util',
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

		if (formSelector.get(0).tagName !== 'INPUT') {
			formSelector = formSelector.find(':input');
		}

		formSelector.serializeArray().forEach(function(item) {
			formData[item.name] = item.value;
		});

		if (this.debug) {
			console.log('XQCore - Serialize form:', formSelector, formData);
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

	/**
	 * Checks the validity of an url
	 *
	 * @param {String} url URL
	 */
	util.checkUrl = function(url) {

		if (!/^http(s)?:\/\/\S\.[a-zA-Z]{2,10}\/?$/.test(url)) {
			return 'invalid-url';
		}
	};

	return util;

})(jQuery);
/*jshint -W014 */
/**
 * XQCore Router API
 *
 * @author Andi Heinkelein - noname-media.com
 * @copyright Andi Heinkelein - noname-media.com
 * @package XQCore
 *
 * Based on router.js
 * Copyright Aaron Blohowiak and TJ Holowaychuk 2011.
 * https://github.com/aaronblohowiak/routes.js
 */
XQCore.Router = (function(undefined) {
	'use strict';

	/**
	 * Convert path to route object
	 *
	 * A string or RegExp should be passed,
	 * will return { re, src, keys} obj
	 *
	 * @param  {String / RegExp} path
	 * @return {Object}
	 */
	var Route = function(path){
		//using 'new' is optional
		
		var src, re, keys = [];
		
		if(path instanceof RegExp){
			re = path;
			src = path.toString();
		}else{
			re = pathToRegExp(path, keys);
			src = path;
		}

		return {
			re: re,
			src: path.toString(),
			keys: keys
		};
	};

	/**
	 * Normalize the given path string,
	 * returning a regular expression.
	 *
	 * An empty array should be passed,
	 * which will contain the placeholder
	 * key names. For example "/user/:id" will
	 * then contain ["id"].
	 *
	 * @param  {String} path
	 * @param  {Array} keys
	 * @return {RegExp}
	 */
	var pathToRegExp = function (path, keys) {
		path = path
			.concat('/?')
			.replace(/\/\(/g, '(?:/')
			.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
				keys.push(key);
				slash = slash || '';
				return ''
					+ (optional ? '' : slash)
					+ '(?:'
					+ (optional ? slash : '')
					+ (format || '') + (capture || '([^/]+?)') + ')'
					+ (optional || '');
			})
			.replace(/([\/.])/g, '\\$1')
			.replace(/\*/g, '(.+)');
		return new RegExp('^' + path + '$', 'i');
	};

	/**
	 * Attempt to match the given request to
	 * one of the routes. When successful
	 * a  {fn, params, splats} obj is returned
	 *
	 * @param  {Array} routes
	 * @param  {String} uri
	 * @return {Object}
	 */
	var match = function (routes, uri) {
		var captures, i = 0;

		for (var len = routes.length; i < len; ++i) {
			var route = routes[i],
				re = route.re,
				keys = route.keys,
				splats = [],
				params = {},
				j;

			captures = re.exec(uri);
			if (captures) {
				for (j = 1, len = captures.length; j < len; ++j) {
					var key = keys[j-1],
						val = typeof captures[j] === 'string'
							? decodeURIComponent(captures[j])
							: captures[j];
					if (key) {
						params[key] = val;
					} else {
						splats.push(val);
					}
				}

				return {
					params: params,
					splats: splats,
					route: route.src
				};
			}
		}
	};

	/**
	 * Default "normal" router constructor.
	 * accepts path, fn tuples via addRoute
	 * returns {fn, params, splats, route}
	 *  via match
	 *
	 * @return {Object}
	 */
	// var getRouter = function() {
	//   //using 'new' is optional
	//   return {
	//     routes: [],
	//     routeMap : {},
	//     addRoute: function(path, fn) {
	//       if (!path) {
	//         throw new Error(' route requires a path');
	//       }

	//       if (!fn) {
	//        throw new Error(' route ' + path.toString() + ' requires a callback');
	//       }

	//       var route = new Route(path);
	//       route.fn = fn;

	//       this.routes.push(route);
	//       this.routeMap[path] = fn;
	//     },

	//     match: function(pathname) {
	//       var route = match(this.routes, pathname);
	//       if(route){
	//         route.fn = this.routeMap[route.route];
	//       }
	//       return route;
	//     }
	//   };
	// };

	var router = function(conf) {
		conf = XQCore.extend({
			debug: false
		}, conf);

		this.debug = Boolean(conf.debug);

		this.routes = [];
		this.routeMap = {};
	};

	router.prototype.addRoute = function(path, fn) {
		if (!path) {
			throw new Error(' route requires a path');
		}

		if (!fn) {
			throw new Error(' route ' + path.toString() + ' requires a callback');
		}

		var route = new Route(path);
		route.fn = fn;

		this.routes.push(route);
		this.routeMap[path] = fn;
	};

	router.prototype.match = function(pathname) {
		var route = match(this.routes, pathname);
		if(route){
			route.fn = this.routeMap[route.route];
		}
		return route;
	};

	/**
	 * Fires a give route
	 *
	 * @param  {String} route	The route to fire
	 * @param  {Object}	data	Callback data
	 *
	 * @return {Boolean}       Returns the matched route
	 */
	router.prototype.fire = function(route, data) {
		route = this.match(route);
		if (route) {
			route.fn(data);
		}
	};

	return router;

})();
(function(proto, undefined) {
	var cssTransition;

	var setTransitionFunction = function() {
		return 'transition' in document.body.style ? 'transition' :
				'MozTransition' in document.body.style ? 'MozTransition' :
				'WebkitTransition' in document.body.style ? 'WebkitTransition' :
				'OTransition' in document.body.style ? 'OTransition' :
				'MsTransition' in document.body.style ? 'MsTransition' :
				undefined;
	};

	proto.slideIn = function(conf) {
		conf = $.extend({
			parent: this.el.parentNode,
			transition: 'left .75s',
			direction: 'auto'
		}, conf);

		if (cssTransition === undefined) {
			cssTransition = setTransitionFunction();
		}

		if (conf.parent && this.el) {
			this.log('> slide plugin > Slide view', this.el, 'in container', conf.parent);
			// console.log({
			// 	el: conf.parent,
			// 	cw: conf.parent.clientWidth,
			// 	ow: conf.parent.offsetWidth,
			// 	w: conf.parent.style.width
			// });
			var posX = conf.parent.offsetWidth;
			this.el.style.display = 'block';
			this.el.style[cssTransition] = 'none';
			this.el.style.left = posX + 'px';
			window.setTimeout(function() {
				this.el.style[cssTransition] = conf.transition;
				this.el.style.left = '0';
			}.bind(this));
		}
		else {
			this.warn('> slide plugin > Can\'t slide view! View or parent not found! View', this.el, 'in container', conf.parent);
		}
	};

	proto.slideOut = function(conf) {
		conf = $.extend({
			parent: this.el.parentNode,
			transition: 'left .75s',
			direction: 'auto'
		}, conf);

		if (cssTransition === undefined) {
			cssTransition = setTransitionFunction();
		}

		if (conf.parent && this.el) {
			this.log('> slide plugin > Slide view', this.el, 'in container', conf.parent);
			// console.log({
			// 	el: conf.parent,
			// 	cw: conf.parent.clientWidth,
			// 	ow: conf.parent.offsetWidth,
			// 	w: conf.parent.style.width
			// });
			var posX = conf.parent.offsetWidth;
				this.el.style[cssTransition] = conf.transition;
				this.el.style.left = posX + 'px';

			var transitionEndFunc = function() {
				if (+this.el.style.left.replace('px', '') >= posX) {
					this.el.style.display = 'none';
					this.el.style[cssTransition] = 'none';
				}
				this.el.removeEventListener('transitionend', transitionEndFunc);
			}.bind(this);
			
			this.el.addEventListener('transitionend', transitionEndFunc);
		}
		else {
			this.warn('> slide plugin > Can\'t slide view! View or parent not found! View', this.el, 'in container', conf.parent);
		}
	};

})(XQCore.View.prototype);

 return XQCore;
}));

