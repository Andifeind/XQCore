/**
 * XQCore.GetSet
 *
 * @module XQCore.GetSet
 * @requires XQCore.Logger
 * @requires XQCore.Event
 */
XQCore.GetSet = (function(window, document, $, undefined) {

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

		console.log(dataset === this.properties);
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

		console.log(dataset, this.properties);
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
			//jshint forin: false
			for (var key in sortKeys) {
				order = String(undotify(key, a)).localeCompare(String(undotify(key, b)));
				if (order === 0) {
					continue;
				}
				else if(sortKeys[key] === -1) {
					order = order > 0 ? -1 : 1;
				}

				break;
			}

			return order;
		});

		this.set(path, data);
		return data;
	};

	getset.prototype.validate = function(data) {
		var failed = [];

		if (this.schema) {
			Object.keys(this.schema).forEach(function(key) {
				var validationResult = this.validateOne(key, data[key]);

				if (validationResult.isValid === true) {
					data[key] = validationResult.value;
				}
				else {
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
	 * @param  {String} key   Property key
	 * @param  {Any} value Property value
	 *
	 * @return {Object}       Returns a ValidatorResultItemObject
	 */
	getset.prototype.validateOne = function(key, value) {
		var failed = null,
			schema = this.schema[key];

		console.log('Schema', schema, schema.match);
		if (value === '' && schema.noEmpty === true) {
			value = undefined;
		}

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
			if (schema.convert && typeof(value) === 'number') {
				value = String(value);
			}

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

		if (failed === null) {
			failed = {
				isValid: true,
				value: value,
				error: null
			};
		}
		else {
			this.warn('Validation error on property', key, failed, 'Data:', value);
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


	return getset;
})(window, document, jQuery);