/*!
 * XQCore Minimal - 0.4.11
 * 
 * Model View Presenter Javascript Framework
 *
 * XQCore is licenced under MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Copyright (c) 2012 - 2013 Noname Media, http://noname-media.com
 * Author Andi Heinkelein
 *
 * Creation Date: 2013-11-22
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('xqcore', ['jquery', 'handlebars'], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'), root.Handlebars);
    } else {
        root.XQCore = factory(root.jQuery, root.Handlebars);
    }
}(this, function (jQuery) {


/*jshint evil:true */
/*global XQCore:true */

/**
 * XQCore main object
 *
 * @package XQcore
 * @type {Object}
 */
var XQCore = {
	version: '0.4.11',
	defaultRoute: 'default',
	html5Routes: false,
	hashBang: '#!',
	callerEvent: 'callerEvent'
};


//XQCore helper functions
XQCore.extend = $.extend;

XQCore._dump = {};
XQCore.dump = function(componentName) {
	if (XQCore._dump[componentName]) {
		console.log('[XQCore dump]', componentName, XQCore._dump[componentName]);
		return XQCore._dump[componentName];
	}

	return false;
};

 return XQCore;
}));

