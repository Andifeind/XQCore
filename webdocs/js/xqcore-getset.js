XQCore.GetSet = (function(window, document, $, undefined) {
	var getset = function(conf) {
		this.properties = {};
		this._isValid = false;

		if (conf) {
			this.schema = conf.schema;
			this.debug = Boolean(conf.debug);
		}

		this.name = 'GetSet';
		$.extend(this, new XQCore.Logger());
		$.extend(this, new XQCore.Event());
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

	// $.extend(getset.prototype, new XQCore.Event());

	/**
	 * Set getset data
	 *
	 * @param {Object or String} data/key
	 * @param {Object} value Data value
	 */
	getset.prototype.set = function() {
		var newData = {},
			oldData = this.get(),
			validateResult,
			key;

		if (typeof arguments[0] === 'object') {
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
			console.log('Use custom validation', this.customValidate);
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
	 * Get one or all properties from getset
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
	};

	/**
	 * Append data to a subset
	 *
	 * @param {String} path path to subset
	 * @param {Object} data data to add
	 */
	getset.prototype.append = function(path, data) {
		var dataset = this.properties;
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
	getset.prototype.prepend = function(path, data) {
		var dataset = this.properties;
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

	getset.prototype.validate = function(data) {
		var failed = [];

		if (this.schema) {
			Object.keys(this.schema).forEach(function(key) {
				var validationResult = this.validateOne(key, data[key]);

				if (validationResult !== null) {
					failed.push(validationResult);
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

	getset.prototype.validateOne = function(key, value) {
		var failed = null,
			schema = this.schema[key];

		console.log('Schema', schema, schema.match);
		if ((value === undefined || value === null) && schema.default) {
			value = schema.default;
		}

		if ((value === undefined || value === null || value === '') && schema.required === true) {
			failed = {
				property: key,
				msg: 'Property is undefined or null, but it\'s required',
				errCode: 10
			};
		}
		else if (schema.type === 'string') {
			if (schema.type !== typeof(value)) {
				failed = {
					property: key,
					msg: 'Property type is a ' + typeof(value) + ', but a string is required',
					errCode: 11
				};
			}
			else if(schema.min && schema.min > value.length) {
				failed = {
					property: key,
					msg: 'String length is too short',
					errCode: 12
				};
			}
			else if(schema.max && schema.max < value.length) {
				failed = {
					property: key,
					msg: 'String length is too long',
					errCode: 13
				};
			}
			else if(schema.match && !schema.match.test(value)) {
				failed = {
					property: key,
					msg: 'String doesn\'t match regexp',
					errCode: 14
				};
			}

		}
		else if(schema.type === 'number') {
			if (schema.convert && typeof(value) === 'string') {
				value = parseInt(value, 10);
			}

			if (schema.type !== typeof(value)) {
				failed = {
					property: key,
					msg: 'Property type is a ' + typeof(value) + ', but a number is required',
					errCode: 21
				};
			}
			else if(schema.min && schema.min > value) {
				failed = {
					property: key,
					msg: 'Number is too low',
					errCode: 22
				};
			}
			else if(schema.max && schema.max < value) {
				failed = {
					property: key,
					msg: 'Number is too high',
					errCode: 23
				};
			}
		}
		else if(schema.type === 'date') {
			if (value) {
				var date = Date.parse(value);
				if (isNaN(date)) {
					failed = {
						property: key,
						msg: 'Property isn\'t a valid date',
						errCode: 31
					};
				}
			}
		}
		else if(schema.type === 'array') {
			if (!Array.isArray(value)) {
				failed = {
					property: key,
					msg: 'Property type is a ' + typeof(value) + ', but an array is required',
					errCode: 41
				};
			}
			else if(schema.min && schema.min > value.length) {
				failed = {
					property: key,
					msg: 'Array length is ' + value.length + ' but must be greater than ' + schema.min,
					errCode: 42
				};
			}
			else if(schema.max && schema.max < value.length) {
				failed = {
					property: key,
					msg: 'Array length is ' + value.length + ' but must be lesser than ' + schema.max,
					errCode: 43
				};
			}
		}
		else if(schema.type === 'object') {
			if (typeof(value) !== 'object') {
				failed = {
					property: key,
					msg: 'Property isn\'t a valid object',
					errCode: 51
				};
			}
		}
		else if(schema.type === 'boolean') {
			if (typeof(value) !== 'object') {
				failed = {
					property: key,
					msg: 'Property isn\'t a valid boolean',
					errCode: 61
				};
			}
		}
		else {

		}

		if (failed !== null) {
			this.warn('Validation error on property', key, failed, 'Data:', value);
		}

		return failed;
	};

	getset.prototype.isValid = function() {
		return this._isValid;
	};


	return getset;
})(window, document, jQuery);