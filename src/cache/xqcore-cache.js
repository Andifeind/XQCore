XQCore.Cache = (function(undefined) {

	var Cache = function(conf) {
		this.name = '';

		if (conf.useSessionStorage === true) {
			this.__cache = sessionStorage;
		}
		else {
			this.__cache = localStorage;
		}
	};

	/**
	 * Calculate expiry
	 */
	Cache.prototype.getExpiry = function(expiry) {
		if (expiry === undefined) {
			return null;
		}
	};

	/**
	 * Add data to cache
	 *
	 * @param {String} key  Data key, if is an object, it will be serialized
	 * @param {Any} data Chache data
	 */
	Cache.prototype.set = function(key, data) {
		if (typeof key === 'object') {
			key = $.serialize(key);
		}

		var expiry = this.getExpiry(options.expiry);

		data = {
			key: key,
			data: data,
			expiry: expiry
		};
		this.log('Add data to cache', key, data);
		this.__cache.setItem(key, data);
	};

	return Cache;

})();