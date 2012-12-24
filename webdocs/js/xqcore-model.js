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

		return null;
	};

	return model;
})(window, document, jQuery);
