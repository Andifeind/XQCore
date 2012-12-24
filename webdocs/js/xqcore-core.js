/*jshint evil:true */
var XQCore = {
	version: 0.1,
	defaultRoute: 'default'
};

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
