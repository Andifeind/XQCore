/*jshint evil:true */
/*global XQCore:true */

/**
 * XQCore main object
 *
 * @package XQcore
 * @type {Object}
 */
var XQCore = {
	version: '<%= pkg.version %>',
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