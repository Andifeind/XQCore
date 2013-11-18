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

		this.init();
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
