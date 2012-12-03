XQCore.Model = (function(window, document, $, undefined) {
	var model;

	model = function(conf) {
		if (conf === undefined) {
			conf = {};
		}

		$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
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
