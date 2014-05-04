/**
 * Extends XQCore with some usefull functions
 */
(function(XQCore, undefined) {
	'use strict';

	XQCore.undotify = function(path, obj) {
		if(path) {
			path = path.split('.');
			path.forEach(function(key) {
				obj = obj[key];
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

})(XQCore);