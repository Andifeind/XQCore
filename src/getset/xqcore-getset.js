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