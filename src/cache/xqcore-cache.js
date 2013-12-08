(function(XQCore, undefined) {
	'use strict';

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
	 * @param {String} key  Data key
	 * @param {Any} data Chache data
	 */
	Cache.prototype.set = function(key, data, options) {
		options = options || {};
		
		var expiry = this.getExpiry(options.expiry);

		data = {
			key: key,
			data: data,
			expiry: expiry
		};
		this.log('Add data to cache', key, data);
		this.__cache.setItem(key, data);
	};

	XQCore.Cache = Cache;

})(XQCore);