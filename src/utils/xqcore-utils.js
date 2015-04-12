/**
 * Extends XQCore with some usefull functions
 */
(function(XQCore, undefined) {
	'use strict';

	XQCore.undotify = function(path, obj) {
		if(path) {
			path = path.split('.');
			path.forEach(function(key) {
				obj = obj ? obj[key] : undefined;
			});
		}

		return obj;
	};

	/**
	 * Creates a object from an dotified key and a value
	 *
	 * @public
	 * @method dedotify
	 * 
	 * @param {Object} obj Add new value to obj. This param is optional.
	 * @param {String} key The dotified key
	 * @param {Any} value The value
	 *
	 * @returns {Object} Returns the extended object if obj was set otherwis a new object will be returned
	 */
	XQCore.dedotify = function(obj, key, value) {

		if (typeof obj === 'string') {
			value = key;
			key = obj;
			obj = {};
		}

		var newObj = obj;

		if(key) {
			key = key.split('.');
			var len = key.length;
			key.forEach(function(k, i) {
				if (i === len - 1) {
					if (/\[\]$/.test(k)) {
						k = k.substr(0, k.length - 2);
						if (!obj[k]) {
							obj[k] = [];
						}
						obj[k].push(value);
						return;
					}

					obj[k] = value;
					return;
				}

				if (!obj[k]) {
					obj[k] = {};
				}

				obj = obj[k];
			});
		}

		obj = value;

		return newObj;
	};

	/**
	 * Creates a unique id
	 *
	 * @param {Number} len (Optional) String length. Defaults to 7
	 * @returns {String} Unique string
	 */
	XQCore.uid = function(len) {
		len = len || 7;
		var str = '';

		while (str.length < len) {
			var part = Math.random().toString(36).substr(2);
			str += part;
		}

		return str.substr(0, len);
	};

})(XQCore);