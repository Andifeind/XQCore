/**
 *	@requires XQCore.Utils
 *	@requires XQCore.Event
 *	@requires XQCore.Logger
 */
(function(XQCore, undefined) {
	'use strict';
	var Model;

	Model = function(name, conf) {
		if (typeof arguments[0] === 'object') {
			conf = name;
			name = conf.name;
		}

		/**
		 * Enable debug mode
		 * @public
		 * @type {Boolean}
		 */
		this.debug = XQCore.debug;

		if (conf === undefined) {
			conf = {};
		}

		this.__state = 'starting';
		this.__unfiltered = {};

		this.customValidate = conf.validate;
		delete conf.validate;

		this.conf = conf;

		this.name = (name ? name.replace(/Model$/, '') : 'Nameless') + 'Model';
		this._isValid = false;
		this.properties = {};
		this.schema = conf.schema;
	};


	XQCore.extend(Model.prototype, new XQCore.Event(), new XQCore.Logger());

	if (XQCore.Sync) {
		XQCore.extend(Model.prototype, XQCore.Sync.prototype);
	}

	Model.prototype.init = function() {
		var self = this,
			conf = this.conf;

		if (typeof conf === 'function') {
			conf.call(this, self);
		}
		else {
			XQCore.extend(this, conf);
		}

		if (this.debug) {
			XQCore._dump[this.name] = this;
		}

		//Add default values
		if (this.defaults && !XQCore.isEmptyObject(this.defaults)) {
			this.set(this.defaults);
		}

		this.state('ready');
	};

	/**
	 * Change the model state
	 *
	 * @method state
	 * @param {String} state New state
	 */
	Model.prototype.state = function(state) {
		this.__state = state;
		this.emit('state.' + state);
		this.emit('state.change', state);
	};

	/**
	 * Get the current model state
	 *
	 * @method getState
	 */
	Model.prototype.getState = function() {
		return this.__state;
	};

	/**
	 * Set model data
	 *
	 * Triggers a data.change event if data was set succesfully
	 *
	 * @method set
	 * @param {Object} data
	 */
	
	/**
	 * Set model data
	 *
	 * Triggers these events if data was set succesfully<br>
	 * data.change<br>
	 * &lt;key&gt;.change
	 *
	 * options: {
	 *   silent: <Boolean> Don't trigger any events
	 *   noValidation: <Boolean> Don't validate
	 *   validateOne: <Boolean> Only if setting one item, validate the item only
	 * }
	 *
	 * @method set
	 * @param {String} key
	 * @param {Object} value Data value
	 * @param {Object} options Options
	 */
	Model.prototype.set = function(key, value, options) {
		var newData = {},
			oldData = this.get(),
			validateResult,
			setItem = false,
			setAll = false;

		options = options || {};

		if (arguments[0] === null) {
			newData = arguments[1];
			setAll = true;
			this.log('Set data', newData, oldData);
		}
		else if (typeof arguments[0] === 'object') {
			//Add a dataset
			key = null;
			options = value || {};
			newData = options.extend ? XQCore.extend(newData, oldData, arguments[0]) : arguments[0];
			setAll = true;
			this.log('Set data', newData, oldData);
		}
		else if (typeof arguments[0] === 'string') {
			newData = XQCore.extend({}, this.get());
			setItem = true;
			XQCore.dedotify(newData, key, value);
			this.log('Set data', newData, oldData);

			options = options || {};
			if (!this.customValidate && options.validateOne) {
				options.noValidation = true;
				validateResult = this.validateOne(this.schema[key], value);
				if (validateResult.isValid === false) {
					this.warn('Validate error in model.set', validateResult);
					if (options.silent !== true) {
						this.emit('validation.error', validateResult, newData);
					}
					return false;
				}
			}
		}
		else {
			this.warn('Data are incorrect in model.set()', arguments);
		}

		options = options || {};

		if (!this.customValidate && this.schema && options.noValidation !== true) {
			validateResult = this.validate(newData);
			if (validateResult !== null) {
				this.warn('Validate error in model.set', validateResult);
				if (options.silent !== true) {
					this.emit('validation.error', validateResult, newData);
				}
				return false;
			}
		}

		if (this.customValidate && options.noValidation !== true) {
			validateResult = this.customValidate(newData);
			this.log('Using a custom validation which returns:', validateResult);
			if (validateResult !== null) {
				this.warn('Validate error in model.set', validateResult);
				this.emit('validation.error', validateResult, newData);
				return false;
			}
		}

		this.properties = newData;
		if (options.silent !== true) {
			if (setAll) {
				if (typeof this.sync === 'function' && options.sync !== false) {
					this.sync('replace', newData);
				}

				this.emit('data.replace', newData, oldData);
			}
			else if (setItem){
				if (typeof this.sync === 'function' && options.sync !== false) {
					this.sync('item', key, value);
				}
				
				this.emit('data.item', key, value);
			}

			this.emit('data.change', newData, oldData);
		}

		return true;
	};

	/**
	 * Get one or all properties from a dataset
	 *
	 * @param  {String} key Data key
	 *
	 * @return {Object}     model dataset
	 */
	Model.prototype.get = function(key) {
		if (key === undefined) {
			return this.properties;
		}
		else {
			return XQCore.undotify(key, this.properties);
		}
	};

	/**
	 * Check wether model has a dataset
	 *
	 * @param {String} key Dataset key
	 * @return {Boolean} Returns true if model has a dataset with key
	 */
	Model.prototype.has = function(key) {
		return !!this.properties[key];
	};

	/**
	 * Remove all data from model
	 */
	Model.prototype.reset = function() {
		this.log('Reset model');
		this.properties = {};
		// this.removeAllListeners();
	};

	/**
	 * Append data to a subset
	 *
	 * @param {String} path path to subset
	 * @param {Object} data data to add
	 */
	Model.prototype.append = function(path, data, options) {
		var dataset = XQCore.undotify(path, this.properties);

		options = options || {};

		if (dataset instanceof Array) {
			dataset.push(data);
		}
		else if (typeof dataset === 'undefined') {
			XQCore.dedotify(this.properties, path, [data]);
		}
		else if (typeof dataset === 'object' && !path && XQCore.isEmptyObject(this.properties)) {
			this.properties = [data];
		}
		else {
			this.error('Model.append requires an array. Dataset isn\'t an array. Path: ', path);
			return;
		}

		if (options.silent !== true) {
			if (typeof this.sync === 'function' && options.sync !== false) {
				this.sync('append', path, data);
			}

			this.emit('data.append', path, data);
			this.emit('data.change', this.properties);
		}
	};

	/**
	 * Prepend data to a subset
	 *
	 * @param {String} path path to subset
	 * @param {Object} data data to add
	 */
	Model.prototype.prepend = function(path, data, options) {
		var dataset = XQCore.undotify(path, this.properties);

		options = options || {};

		if (dataset instanceof Array) {
			dataset.unshift(data);
		}
		else if (typeof dataset === 'undefined') {
			XQCore.dedotify(this.properties, path, [data]);
		}
		else if (typeof dataset === 'object' && !path && XQCore.isEmptyObject(this.properties)) {
			this.properties = [data];
		}
		else {
			this.error('Model.prepend requires an array. Dataset isn\'t an array. Path: ', path);
			return;
		}

		if (options.silent !== true) {
			if (typeof this.sync === 'function' && options.sync !== false) {
				this.sync('prepend', path, data);
			}

			this.emit('data.prepend', path, data);
			this.emit('data.change', this.properties);
		}
	};

	Model.prototype.insert = function(path, index, data, options) {
		var dataset = XQCore.undotify(path, this.properties);

		options = options || {};

		if (dataset instanceof Array) {
			dataset.splice(index, 0, data);
		}
		else if (typeof dataset === 'undefined') {
			XQCore.dedotify(this.properties, path, [data]);
		}
		else if (typeof dataset === 'object' && !path && XQCore.isEmptyObject(this.properties)) {
			this.properties = [data];
		}
		else {
			this.error('Model.insert requires an array. Dataset isn\'t an array. Path: ', path);
			return;
		}

		if (options.silent !== true) {
			if (typeof this.sync === 'function' && options.sync !== false) {
				this.sync('insert', path, 1, data);
			}

			this.emit('data.insert', path, index, data);
			this.emit('data.change', this.properties);
		}
	};

	/**
	 * Remove a subset
	 *
	 * @param {String} path path to subset
	 * @param {Number} index Index of the subsut to remove
	 * @param {Object} options Remove options
	 *
	 * @return {Object} removed subset
	 */
	Model.prototype.remove = function(path, index, options) {
		var dataset = XQCore.undotify(path, this.properties),
			removed = null;


		options = options || {};

		if (dataset instanceof Array) {
			removed = dataset.splice(index, 1);
		}
		else if (typeof dataset === 'object') {
			this.error('Model.remove requires an array. Dataset isn\'t an array. Path: ', path);
			return;
		}

		if (removed && options.silent !== true) {
			if (typeof this.sync === 'function' && options.sync !== false) {
				this.sync('remove', path, index);
			}

			this.emit('data.remove', path, index, removed[0]);
			this.emit('data.change', this.properties);
		}

		return removed;
	};

	/**
	 * Search an item in models properties
	 *
	 * @param {String} path Path to the parent property. We use dot notation to navigate to subproperties. (data.bla.blub) (Optional)
	 * @param {Object} searchfor Searching for object
	 * @return {Object} Returns the first matched item or null
	 */
	Model.prototype.search = function(path, searchfor) {
		var parent;

		if (arguments.length === 1) {
			searchfor = path;
			path = '';
			parent = this.properties;
		}
		else {
			parent = XQCore.undotify(path, this.properties);
		}

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
	Model.prototype.sortBy = function(path, sortKeys) {
		if (arguments.length === 1) {
			sortKeys = path;
			path = null;
		}

		var data = XQCore.undotify(path, this.properties),
			order;

		data.sort(function(a, b) {
			order = -1;
			for (var key in sortKeys) {
				if (sortKeys.hasOwnProperty(key)) {
					order = String(XQCore.undotify(key, a)).localeCompare(String(XQCore.undotify(key, b)));
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

	/**
	 * Filter an array collection by a given filter function
	 *
	 * @param {String} path Path to the collection
	 * @param {String | Function} filter Filter function
	 *
	 */
	Model.prototype.filter = function(path, property, query, fn) {
		if (arguments.length === 1) {
			fn = path;
			path = null;
		}

		if (typeof fn === 'string') {
			if (this.__registeredFilter[fn]) {
				fn = this.__registeredFilter[fn];
			}
			else {
				throw new Error('Filter ' + fn + ' not registered!');
			}
		}

		//We use a for i instead of Array.filter because it's faster!
		var data = XQCore.undotify(path, this.__unfiltered.data || this.properties);
		var filtered = [];
		for (var i = 0, len = data.length; i < len; i++) {
			if (fn(property, query, data[i])) {
				filtered.push(data[i]);
			}
		}

		this.__unfiltered = {
			path: path,
			data: data
		};

		this.set(path, filtered);
		return filtered;
	};

	/**
	 * Resets a filter
	 * @method filterReset
	 * @param {Object} options Set options
	 */
	Model.prototype.filterReset = function(options) {
		if (this.__unfiltered) {
			this.set(this.__unfiltered.path, this.__unfiltered.data, options);
		}
	};

	Model.prototype.validate = function(data, schema) {
		var failed = [];
			
		schema = schema || this.schema;

		if (schema) {
			Object.keys(schema).forEach(function(key) {
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
	Model.prototype.validateOne = function(schema, value) {
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

	Model.prototype.isValid = function() {
		return this._isValid;
	};

	Model.prototype.setData = function(data, caller) {
		return this.set(data, {
			extend: true
		});
	};

	/**
	 * Register a filter function 
	 *
	 * XQCore.Model.registerFilter('myfilter', fn);
	 * Registers a filter for all models
	 *
	 * instance.registerFilter('myfilter', fn);
	 * Registers a filter for the instance only.
	 * 
	 * @method registerFilter
	 * @param {String} filterName [description]
	 * @param {Function} filterFunction [description]
	 */
	Model.registerFilter = function(filterName, filterFunction) {
		if (typeof filterFunction !== 'function') {
			throw new Error('Filter function isn\'t a function');
		}

		var obj = typeof this === 'function' ? Model.prototype : this;
		obj.__registeredFilter[filterName] = filterFunction;
	};

	Model.prototype.registerFilter = Model.registerFilter;

	Model.prototype.__registeredFilter = {
		quicksearch: function(property, query, item) {
			// console.log('Filter item:', property, query, item);
			var value = XQCore.undotify(property, item);
			var pat = new RegExp(query.replace(/[a-z0-9äüöß]/g, '$&.*'), 'i');
			// console.log('Pat:', pat.source);
			return pat.test(value);
		}
	};

	XQCore.Model = Model;
})(XQCore);
