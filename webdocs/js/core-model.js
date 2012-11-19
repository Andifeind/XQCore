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