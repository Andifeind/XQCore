/*jshint evil:true */
var XQCore = {
	version: 0.1,
	defaultRoute: 'default'
};

/**
 * Implement include support
 *
 * File must be absolute to the document root
 *
 * @param {String} file Filename to be load
 */
if (!window.include) {
	window.include = function(file, callback) {
		var url = location.protocol + '//' + location.host + file;
		$.ajax({
			url: url,
			dataType: "script",
			success: callback,
			async: false
		});
	};

	window.preload = function(file) {
		var url = location.protocol + '//' + location.host + file,
			script;

		$.ajax({
			url: url,
			dataType: "text",
			success: function(data) {
				script = data;
			},
			async: false
		});

		return {
			execute: function(scope) {
				eval.call(scope || window, script);
			}
		};
	};
}

XQCore.Presenter = (function() {

	var presenter = function(conf) {
		var self = this;
		
		this.root = '/';
		this.debug = false;
		this.routes = [];
		
		conf = conf || {};

		this.customInit = conf.init;
		this.conf = conf;
		delete conf.init;

		$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
		this.name = (conf.name || 'Nameless') + 'Presenter';
		this.eventCallbacks = {};

		this.registeredViews = [];
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
			this.registeredViews.push({
				view: view,
				isReady: false
			});
		};

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
				self.log('popstate event recived', e);

				var route = XQCore.defaultRoute;
				if (/^#![a-zA-Z0-9]+/.test(location.hash)) {
					route = location.hash.substr(2);
				}

				route = self.Router.match(route);
				if (route) {
					route.fn.call(self, e.state);
				}
			}, false);

			window.addEventListener('hashchange', function(e) {
				self.log('hashchange event recived', e, location.hash);
				// var tag = location.hash.substring(1);

				// if (typeof conf[tag] === 'function') {
				//	self.log('Call func', conf[tag]);
				//	conf[tag].call(self);
				// }
			}, false);

			this.on('views.ready',function() {
				var route = XQCore.defaultRoute;
				if (/^#![a-zA-Z0-9]+/.test(location.hash)) {
					route = location.hash.substr(2);
				}

				route = self.Router.match(route);
				if (route) {
					route.fn.call(self, route);
				}
			});
		}
	};

	presenter.prototype.init = function(views) {
		var i;

		console.log('views', views);
		if (views instanceof Array) {
			for (i = 0; i < views.length; i++) {
				this.registerView(views[i]);
			}

			for (i = 0; i < views.length; i++) {
				views[i].init(this);
			}
		}
		else {
			this.registerView(views);
			views.init(this);
		}

		// custom init
		if (typeof this.customInit === 'function') {
			this.customInit.call(this);
		}
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
	 */
	presenter.prototype.pushState = function(data, title, url) {
		history.pushState(data, title, url);
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
		this.conf = conf;
		delete conf.init;

		$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
		this.name = (conf.name || 'Nameless') + 'Model';
		this.debug = Boolean(conf.debug);
		this.propertys = {};
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

		//Add default values
		if (this.defaults) {
			this.set(this.defaults);
		}
	};

	model.prototype.init = function() {
		// custom init
		if (typeof this.customInit === 'function') {
			this.customInit.call(this);
		}
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

		$.extend(this.propertys, newData);
	};

	/**
	 * Get one or all propertys from model
	 *
	 * @param  {String} key Data key
	 *
	 * @return {Object}     Model dataset
	 */
	model.prototype.get = function(key) {
		if (key === undefined) {
			return this.propertys;
		}
		else {
			return this.propertys[key];
		}
	};

	/**
	 * Check wether model has a dataset
	 *
	 * @param {String} key Dataset key
	 * @return {Boolean} Returns true if model has a dataset with key
	 */
	model.prototype.has = function(key) {
		return !!this.propertys[key];
	};

	/**
	 * Remove all data from model
	 */
	model.prototype.reset = function() {
		this.log('Reset model');
		this.propertys = {};
	};

	/**
	 * Append data to a subset
	 *
	 * @param {String} path path to subset
	 * @param {Object} data data to add
	 */
	model.prototype.append = function(path, data) {
		var dataset = this.propertys;
		path.split('.').forEach(function(key) {
			dataset = dataset[key];
		});

		if (dataset instanceof Array) {
			dataset.push(data);
		}
		else {
			dataset = $.extend(dataset, data);
		}

		return data;
	};

	/**
	 * Prepend data to a subset
	 *
	 * @param {String} path path to subset
	 * @param {Object} data data to add
	 */
	model.prototype.prepend = function(path, data) {
		var dataset = this.propertys;
		path.split('.').forEach(function(key) {
			dataset = dataset[key];
		});

		if (dataset instanceof Array) {
			dataset.unshift(data);
		}
		else {
			dataset = $.extend(data, dataset);
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
	model.prototype.remove = function(path, index) {
		var dataset = this.propertys,
			data = null;
		path.split('.').forEach(function(key) {
			dataset = dataset[key];
		});

		if (dataset instanceof Array) {
			data = dataset.splice(index, 1);
			data = data[0] || null;
		}
		else {
			this.warn('Model.remove() doesn\'t work with Objects in model', this.name);
		}

		return data;
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
	 * @param {Object} data The data to sent to the server
	 * @param {Function} callback Calls callback(err, data, status, jqXHR) if response was receiving
	 */
	model.prototype.send = function(method, data, callback) {

		if (!this.server) {
			this.error('Can not send an ajax request! You must define a server URL first.');
			return false;
		}

		if (data === undefined) {
			data = this.get();
		}

		if (method === undefined) {
			method = 'POST';
		}

		//Handle onSend
		if (typeof this.onSend === 'function') {
			data = this.onSend.call(this, data);
		}

		this.log('Sending an ajax call to ', this.server, 'with data: ', data);

		$.ajax({
			url: this.server,
			type: method,
			data: data,
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
	 * @param  {Object}   data     Dato to sending
	 * @param  {Function} callback Calling on response
	 *
	 * callback: void function(err, data, status, jqXHR)
	 *
	 */
	model.prototype.sendPOST = function(data, callback) {
		this.send('POST', data, callback);
	};

	/**
	 * Sends a GET to the Datastore
	 *
	 * @param  {Object}   data     Dato to sending
	 * @param  {Function} callback Calling on response
	 *
	 * callback: void function(err, data, status, jqXHR)
	 *
	 */
	model.prototype.sendGET = function(data, callback) {
		this.send('GET', data, callback);
	};

	/**
	 * Sends a UPDATE to the Datastore
	 *
	 * @param  {Object}   data     Dato to sending
	 * @param  {Function} callback Calling on response
	 *
	 * callback: void function(err, data, status, jqXHR)
	 *
	 */
	model.prototype.sendUPDATE = function(data, callback) {
		this.send('UPDATE', data, callback);
	};

	/**
	 * Sends a DELETE to the Datastore
	 *
	 * @param  {Object}   data     Dato to sending
	 * @param  {Function} callback Calling on response
	 *
	 * callback: void function(err, data, status, jqXHR)
	 *
	 */
	model.prototype.sendDELETE = function(data, callback) {
		this.send('DELETE', data, callback);
	};

	/**
	 * Search a item in models propertys
	 *
	 * @param {String} path to the parent property. We use dot notation to navigate to subproperties. (data.bla.blub)
	 * @param {Object} searchfor Searching for object
	 * @return {Object} Returns the first matched item or null
	 */
	model.prototype.search = function(path, searchfor) {
		var parent = undotify(path, this.propertys);

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

	return model;
})(window, document, jQuery);

XQCore.View = (function(undefined) {

	var view = function(conf) {

		if (arguments.length === 2) {
			this.presenter = arguments[0];
			conf = arguments[1];
			console.info('Defining View with presenter is deprecated.');
		}

		conf = conf || {
			events: null
		};

		this.customInit = conf.init;
		this.conf = conf;
		delete conf.init;

		$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
		this.name = (conf.name || 'Nameless') + 'View';

		this.debug = Boolean(conf.debug);
	};

	view.prototype.init = function(presenter) {
		var self = this,
			conf = this.conf;

		//If old style
		if (!presenter) {
			presenter = this.presenter;
			presenter.registerView(this);
		}

		console.log('View Init2', this);

		//Register view at presenter
		this.presenter = presenter;

		$(function() {
			this.container = $(conf.container);
			this.$el = this.container;
			this.el = $(conf.container).get(0);
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
										formData = XQCore.Util.serializeForm(e.target);
									}

									tagData = $.extend($(e.target).data(), {
										itemIndex: getItemIndex.call(self, e.target)
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
				} else {
					this.warn('No view events defined');
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
		
	};

	view.prototype.hide = function() {
		
	};

	view.prototype.render = function(data) {
		this.log('Render view template', this.template, 'with data:', data);
		var template = Handlebars.compile(this.template);
		this.container.html(template(data || {}));

		this.emit('content.change');
	};

	view.prototype.renderHTML = function(template, data) {
		this.log('Render view html snipet', template, 'with data:', data);
		template = Handlebars.compile(template);
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

		if (options) {
			//TODO handle transition options
		}

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
								console.log(value);
							}
						}
						catch(err) {

						}
					}

					data[name] = value;
				}
			}

			console.log('Get data', data);

			return data;
		}
		else {
			return null;
		}
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
					console.log(curEl, nextEl);
					console.error('Break loop!');
					break;
				}
			} while(curEl.length && curEl.get(0) !== container);
		}

		return index;
	};



	return view;
})();

/**
 * XQCore EventEmitter
 *
 * Based on EventEmitter v4.0.2 by Oliver Caldwell
 * http://git.io/ee
 *
 */
XQCore.Event = (function() {

	//EventEmitter.js

	/**
	 * EventEmitter v4.0.2 - git.io/ee
	 * Oliver Caldwell
	 * MIT license
	 */

	var EventEmitter = (function() {
	    // JSHint config - http://www.jshint.com/
	    /*jshint laxcomma:true*/

	    // Place the script in strict mode
	    'use strict';

	    /**
	     * Class for managing events.
	     * Can be extended to provide event functionality in other classes.
	     *
	     * @class Manages event registering and emitting.
	     */
	    function EventEmitter(){}

	    // Shortcuts to improve speed and size

	        // Easy access to the prototype
	    var proto = EventEmitter.prototype

	      // Existence of a native indexOf
	      , nativeIndexOf = Array.prototype.indexOf ? true : false;

	    /**
	     * Finds the index of the listener for the event in it's storage array
	     *
	     * @param {Function} listener Method to look for.
	     * @param {Function[]} listeners Array of listeners to search through.
	     * @return {Number} Index of the specified listener, -1 if not found
	     */
	    function indexOfListener(listener, listeners) {
	        // Return the index via the native method if possible
	        if(nativeIndexOf) {
	            return listeners.indexOf(listener);
	        }

	        // There is no native method
	        // Use a manual loop to find the index
	        var i = listeners.length;
	        while(i--) {
	            // If the listener matches, return it's index
	            if(listeners[i] === listener) {
	                return i;
	            }
	        }

	        // Default to returning -1
	        return -1;
	    }

	    /**
	     * Returns the listener array for the specified event.
	     * Will initialise the event object and listener arrays if required.
	     *
	     * @param {String} evt Name of the event to return the listeners from.
	     * @return {Function[]} All listener functions for the event.
	     * @doc
	     */
	    proto.getListeners = function(evt) {
	        // Create a shortcut to the storage object
	        // Initialise it if it does not exists yet
	        var events = this._events || (this._events = {});

	        // Return the listener array
	        // Initialise it if it does not exist
	        return events[evt] || (events[evt] = []);
	    };

	    /**
	     * Adds a listener function to the specified event.
	     * The listener will not be added if it is a duplicate.
	     * If the listener returns true then it will be removed after it is called.
	     *
	     * @param {String} evt Name of the event to attach the listener to.
	     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     * @doc
	     */
	    proto.addListener = function(evt, listener) {
	        // Fetch the listeners
	        var listeners = this.getListeners(evt);

	        // Push the listener into the array if it is not already there
	        if(indexOfListener(listener, listeners) === -1) {
	            listeners.push(listener);
	        }

	        // Return the instance of EventEmitter to allow chaining
	        return this;
	    };

	    /**
	     * Removes a listener function from the specified event.
	     *
	     * @param {String} evt Name of the event to remove the listener from.
	     * @param {Function} listener Method to remove from the event.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     * @doc
	     */
	    proto.removeListener = function(evt, listener) {
	        // Fetch the listeners
	        // And get the index of the listener in the array
	        var listeners = this.getListeners(evt)
	          , index = indexOfListener(listener, listeners);

	        // If the listener was found then remove it
	        if(index !== -1) {
	            listeners.splice(index, 1);

	            // If there are no more listeners in this array then remove it
	            if(listeners.length === 0) {
	                this._events[evt] = null;
	            }
	        }

	        // Return the instance of EventEmitter to allow chaining
	        return this;
	    };

	    /**
	     * Adds listeners in bulk using the manipulateListeners method.
	     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	     * You can also pass it an event name and an array of listeners to be added.
	     *
	     * @param {String|Object} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to add.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     * @doc
	     */
	    proto.addListeners = function(evt, listeners) {
	        // Pass through to manipulateListeners
	        return this.manipulateListeners(false, evt, listeners);
	    };

	    /**
	     * Removes listeners in bulk using the manipulateListeners method.
	     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	     * You can also pass it an event name and an array of listeners to be removed.
	     *
	     * @param {String|Object} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to remove.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     * @doc
	     */
	    proto.removeListeners = function(evt, listeners) {
	        // Pass through to manipulateListeners
	        return this.manipulateListeners(true, evt, listeners);
	    };

	    /**
	     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	     * The first argument will determine if the listeners are removed (true) or added (false).
	     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	     * You can also pass it an event name and an array of listeners to be added/removed.
	     *
	     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	     * @param {String|Object} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     * @doc
	     */
	    proto.manipulateListeners = function(remove, evt, listeners) {
	        // Initialise any required variables
	        var i
	          , value
	          , single = remove ? this.removeListener : this.addListener
	          , multiple = remove ? this.removeListeners : this.addListeners;

	        // If evt is an object then pass each of it's properties to this method
	        if(typeof evt === 'object') {
	            for(i in evt) {
	                if(evt.hasOwnProperty(i) && (value = evt[i])) {
	                    // Pass the single listener straight through to the singular method
	                    if(typeof value === 'function') {
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
	            while(i--) {
	                single.call(this, evt, listeners[i]);
	            }
	        }

	        // Return the instance of EventEmitter to allow chaining
	        return this;
	    };

	    /**
	     * Removes all listeners from a specified event.
	     * If you do not specify an event then all listeners will be removed.
	     * That means every event will be emptied.
	     *
	     * @param {String} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     * @doc
	     */
	    proto.removeEvent = function(evt) {
	        // Remove different things depending on the state of evt
	        if(evt) {
	            // Remove all listeners for the specified event
	            this._events[evt] = null;
	        }
	        else {
	            // Remove all listeners in all events
	            this._events = null;
	        }

	        // Return the instance of EventEmitter to allow chaining
	        return this;
	    };

	    /**
	     * Emits an event of your choice.
	     * When emitted, every listener attached to that event will be executed.
	     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	     * So they will not arrive within the array on the other side, they will be separate.
	     *
	     * @param {String} evt Name of the event to emit and execute listeners for.
	     * @param {Array} [args] Optional array of arguments to be passed to each argument.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     * @doc
	     */
	    proto.emitEvent = function(evt, args) {
	        // Get the listeners for the event
	        // Also initialise any other required variables
	        var listeners = this.getListeners(evt)
	          , i = listeners.length
	          , response;

	        // Loop over all listeners assigned to the event
	        // Apply the arguments array to each listener function
	        while(i--) {
	            // If the listener returns true then it shall be removed from the event
	            // The function is executed either with a basic call or an apply if there is an args array
	            response = args ? listeners[i].apply(null, args) : listeners[i]();
	            if(response === true) {
	                this.removeListener(evt, listeners[i]);
	            }
	        }

	        // Return the instance of EventEmitter to allow chaining
	        return this;
	    };

	    return EventEmitter;
	}());

	//End EventEmitter.js


	var ee,
		event;
	
	function indexOf(eventName, callback) {
		this.objectName = 'XQCore.Event';
		
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
		this.ee = new EventEmitter();
	};

	// event.prototype.on = function(eventName, callback) {

	// };

	// event.prototype.once = function(eventName, callback) {

	// };

	// event.prototype.emit = function(eventName, data) {

	// };

	// event.prototype.remove = function(eventName, callback) {

	// };

	event.prototype.emit = function(eventName, data) {
		if (this.debug) {
			console.debug('XQCore - Emit event', eventName, data);
		}
		return this.ee.emitEvent(eventName, [data], this);
	};

	event.prototype.on = function(eventName, listener) {
		if (this.debug) {
			console.debug('XQCore - Add listener', eventName, listener, this);
		}
		return this.ee.addListener(eventName, listener);
	};

	event.prototype.once = function(eventName, listener) {
		var onceListener = function() {
			this.ee.removeListener(eventName, listener);
			listener.call(null, arguments);
			return true;
		};

		if (this.debug) {
			console.debug('XQCore - Add once listener', eventName, listener);
		}
		return this.ee.addListener(eventName, onceListener);
	};

	event.prototype.off = function(eventName, listener) {
		if (this.debug) {
			console.debug('XQCore - Remove listener', eventName, listener);
		}

		if (listener === undefined) {
			return this.ee.removeEvent(eventName);
		}
		else {
			return this.ee.removeListener(eventName, listener);
		}
	};

	return event;
})();

/**
 * XQCore Logger
 *
 * Based on EventEmitter.js
 * 
 * 
 */
XQCore.Logger = (function(conf) {

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

		conf = localStorage.get('xqcore-onscreen-console') || {
			pos: 'bottom'
		};

		html = '<div id="XQCoreLogger-OnScreenConsole">\
			</div>';
	}

	/**
	 * XQCore Logger is a logging tool to log messages, warnings, errors to the browser or onscreen console
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
 * @return {Object} Returns a singelton object instance of XQCore.Util
 */
XQCore.Util = (function($) {

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

		if (formSelector.get(0).tagName === 'INPUT') {

		}
		else {
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

	return util;

})(jQuery);
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
		conf = $.extend({
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
	console.log('View slide', proto);
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
			console.log({
				el: conf.parent,
				cw: conf.parent.clientWidth,
				ow: conf.parent.offsetWidth,
				w: conf.parent.style.width
			});
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
			console.log({
				el: conf.parent,
				cw: conf.parent.clientWidth,
				ow: conf.parent.offsetWidth,
				w: conf.parent.style.width
			});
			var posX = conf.parent.offsetWidth;
				this.el.style[cssTransition] = conf.transition;
				this.el.style.left = posX + 'px';

			var transitionEndFunc = function() {
				if (+this.el.style.left.replace('px', '') >= posX) {
					this.el.style.display = 'none';
					this.el.style[cssTransition] = 'none';
				}
				else {
					console.warn('Old transitionEndFunc???', this.el, +this.el.style.left.replace('px', ''), this.el.style[cssTransition]);
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