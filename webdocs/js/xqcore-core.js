/*jshint evil:true */
/*global define:false */

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

// if (typeof define === "function" && define.amd) {
// 	console.log('XQCore: using AMD style');
// 	define( "xqcore", ['handlebars'], function (Handlebars) {
// 		XQCore.TemplateEngine = Handlebars;
// 		return XQCore;
// 	});
// } else {
// 	XQCore.TemplateEngine = window.Handlebars;
// 	window.XQCore = XQCore;
// }

/**
 * Implement include support
 *
 * File must be absolute to the document root
 *
 * @param {String} file Filename to be load
 */
if (!window.include) {
	window.include = function(file, callback) {
		var url = location.protocol + '//' + location.host + file;
		$.ajax({
			url: url,
			dataType: "script",
			success: callback,
			async: false
		});
	};

	window.preload = function(file) {
		var url = location.protocol + '//' + location.host + file,
			script;

		$.ajax({
			url: url,
			dataType: "text",
			success: function(data) {
				script = data;
			},
			async: false
		});

		return {
			execute: function(scope) {
				eval.call(scope || window, script);
			}
		};
	};
}


XQCore._dump = {};
XQCore.dump = function(componentName) {
	if (XQCore._dump[componentName]) {
		console.log('[XQCore dump]', componentName, XQCore._dump[componentName]);
		return XQCore._dump[componentName];
	}

	return false;
};