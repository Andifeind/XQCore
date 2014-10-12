/**
 * XQCore.Sync
 *
 * @module  XQCore.Sync
 */
(function(XQCore, undefined) {
	'use strict';

	var $ = XQCore.include('jquery');

	var Sync = function() {

	};

	/**
	 * Called on before sending an ajax request
	 * You can use this function to manipulate all data they be send to the server
	 *
	 * @param {Object} data The data to send to the server
	 * @return {Object} data
	 */
	Sync.prototype.onSend = function(data) {
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
	Sync.prototype.send = function(method, url, data, callback) {
		var self = this;

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

		this.log('Send an ajax call to ', url, 'with data: ', data);
		this.state('syncing');

		$.ajax({
			url: url,
			type: method,
			data: data,
			dataType: 'json',
			success: function(data, status, jqXHR) {
				if (typeof callback === 'function') {
					callback.call(self, null, data, status, jqXHR);
				}
				self.state('success');
			},
			error: function(jqXHR, status, error) {
				if (typeof callback === 'function') {
					callback.call(self, {
						type: status,
						http: error
					}, null, status, jqXHR);
				}
				self.state('failed');
			}
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
	Sync.prototype.sendPOST = function(url, data, callback) {
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
	Sync.prototype.sendGET = function(url, data, callback) {
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
	Sync.prototype.sendPUT = function(url, data, callback) {
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
	Sync.prototype.sendDELETE = function(url, data, callback) {
		this.send('DELETE', url, data, callback);
	};

	/**
	 * Check if model is ready and call func or wait for ready state
	 */
	Sync.prototype.ready = function(func) {
		var self = this;
		
		if (func === true) {
			//Call ready funcs
			if (Array.isArray(this.__callbacksOnReady)) {
				this.log('Trigger ready state');
				this.__callbacksOnReady.forEach(function(func) {
					func.call(self);
				});
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
	Sync.prototype.fetch = function(query, callback) {
		this.sendGET(query, callback);
	};

	/**
	 * Save a model if it's valid
	 */
	Sync.prototype.save = function(data, callback) {
		var self = this;

		if (typeof data === 'function') {
			callback = data;
			data = this.schema ? this.getByKeys(Object.keys(this.schema)) : this.get();
		}

		if (this.isValid()) {
			this.sendPOST(data, function(err, result) {
				self.state(err ? 'error' : 'saved');
				callback(err, result);
			});
		}
		else {
			if (typeof callback === 'function') {
				callback({
					msg: 'Model isn\'t valid. Cancle save'
				});
			}
		}
	};

	/**
	 * Update a model if it's valid
	 */
	Sync.prototype.update = function(data, callback) {
		var self = this;

		if (typeof data === 'function') {
			callback = data;
			data = this.schema ? this.getByKeys(Object.keys(this.schema)) : this.get();
		}

		if (this.isValid()) {
			this.sendPUT(data, function(err, result) {
				self.state(err ? 'error' : 'saved');
				callback(err, result);
			});
		}
		else {
			if (typeof callback === 'function') {
				callback({
					msg: 'Model isn\'t valid. Cancle update'
				});
			}
		}
	};

	XQCore.Sync = Sync;

})(XQCore);