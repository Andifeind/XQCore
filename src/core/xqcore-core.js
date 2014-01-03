/*!
 * XQCore - <%= pkg.version %>
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
        define('xqcore', ['jquery', 'handlebars'], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'), require('handlebars'));
    } else {
        root.XQCore = factory(root.jQuery, root.Handlebars);
    }
}(this, function (jQuery, Handlebars) {
	'use strict';

	/**
	 * XQCore main object
	 *
	 * @package XQcore
	 * @type {Object}
	 */
	XQCore = {
		version: '<%= pkg.version %>',
		defaultRoute: 'default',
		html5Routes: false,
		hashBang: '#!',
		callerEvent: 'callerEvent',
		objectIdPattern: /^[a-zA-Z0-9]{24}$/
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
		else if(moduleName === 'handlebars') {
			return Handlebars;
		}
	};

	XQCore.loadFile = function(src) {
		var content = '';

		jQuery.ajax({
			async: false,
			dataType:'text',
			url: src
		}).done(function(data, textStatus) {
			content = data;
		}).fail(function(jsXhr, txtStatus, err) {
			console.error('Couldn\'t load file "' + src + '"" from server!', err);
		});

		return content;
	};

	return XQCore;
}));

