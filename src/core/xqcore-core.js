/*!
 * XQCore - +<%= pkg.version %>
 * 
 * <%= pkg.description %>
 *
 * XQCore is licenced under MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Copyright (c) 2012 - <%= grunt.template.today("yyyy") %> Noname Media, http://noname-media.com
 * Author Andi Heinkelein
 *
 * Creation Date: <%= grunt.template.today("yyyy-mm-dd") %>
 */

/*global XQCore:true */
var XQCore;

(function (root, factory) {
	/*global define:false */
	'use strict';

	if (typeof define === 'function' && define.amd) {
		define('xqcore', ['jquery'], factory);
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory(require('jquery'));
	} else {
		root.XQCore = factory(root.jQuery);
	}
}(this, function (jQuery) {
	'use strict';

	/**
	 * XQCore main object
	 *
	 * @package XQcore
	 * @type {Object}
	 */
	XQCore = {
		version: '<%= pkg.version %>',
		defaultRoute: 'index',
		html5Routes: false,
		hashBang: '#!',
		callerEvent: 'callerEvent',
		objectIdPattern: /^[a-zA-Z0-9]{24}$/,
		templateEngine: 'firetpl',
		viewsDir: './views/',
		viewExt: '.fire'
	};

	//XQCore helper functions
	XQCore.extend = jQuery.extend;
	XQCore.isEmptyObject = jQuery.isEmptyObject;
	
	/**
	 * Checks for a valid ObjectId
	 * 
	 * The pattern of an objectId can be overwritten by setting the XQCore.objectIdPattern property
	 *
	 * @return {Boolean} Returns true if value is an valid objectId
	 */
	XQCore.isObjectId = function(value) {
		return this.objectIdPattern.test(value);
	};

	XQCore._dump = {};
	XQCore.dump = function(componentName) {
		if (XQCore._dump[componentName]) {
			console.log('[XQCore dump]', componentName, XQCore._dump[componentName]);
			return XQCore._dump[componentName];
		}

		return false;
	};

	XQCore.require = function(moduleName) {
		if (moduleName === 'jquery') {
			return jQuery;
		}
	};

	return XQCore;
}));

