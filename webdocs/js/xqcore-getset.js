XQCore.GetSet = (function(window, document, $, undefined) {
	var getset = function() {

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

	$.extend(getset.prototype, new XQCore.Event());

	/**
	 * Set getset data
	 *
	 * @param {Object or String} data/key
	 * @param {Object} value Data value
	 */
	getset.prototype.set = function() {
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
			this.warn('Data are incorrect in getset.set()', arguments);
		}

		if (this.validate) {
			validateResult = this.validate(newData);
			if (validateResult) {
				this.warn('Validate error in getset.set', validateResult);
				return validateResult;
			}
		}

		$.extend(this.propertys, newData);
		this.emit('data.change', newData);
	};

	/**
	 * Get one or all propertys from getset
	 *
	 * @param  {String} key Data key
	 *
	 * @return {Object}     getset dataset
	 */
	getset.prototype.get = function(key) {
		if (key === undefined) {
			return this.propertys;
		}
		else {
			return this.propertys[key];
		}
	};

	/**
	 * Check wether getset has a dataset
	 *
	 * @param {String} key Dataset key
	 * @return {Boolean} Returns true if getset has a dataset with key
	 */
	getset.prototype.has = function(key) {
		return !!this.propertys[key];
	};

	/**
	 * Remove all data from getset
	 */
	getset.prototype.reset = function() {
		this.log('Reset getset');
		this.propertys = {};
	};

	/**
	 * Append data to a subset
	 *
	 * @param {String} path path to subset
	 * @param {Object} data data to add
	 */
	getset.prototype.append = function(path, data) {
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
	getset.prototype.prepend = function(path, data) {
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
	getset.prototype.remove = function(path, index) {
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
			this.warn('getset.remove() doesn\'t work with Objects in getset', this.name);
		}

		return data;
	};

	/**
	 * Search a item in models propertys
	 *
	 * @param {String} path to the parent property. We use dot notation to navigate to subproperties. (data.bla.blub)
	 * @param {Object} searchfor Searching for object
	 * @return {Object} Returns the first matched item or null
	 */
	getset.prototype.search = function(path, searchfor) {
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


	return getset;
})(window, document, jQuery);