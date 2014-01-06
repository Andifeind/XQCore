/*global $:false */
XQCore.LoggerUI = (function() {
	'use strict';

	var tmpl = '<div class="XQCoreLogger"></div>';

	var convertObject = function(obj, indention) {

		if (typeof obj !== 'object') {
			return obj;
		}

		var keys = Object.keys(obj).sort();
		var objOut = [];

		indention += '    ';

		keys.forEach(function(key) {
			objOut.push('<dl><dt>' + key + '</dt><dd>' + obj[key] + '</dd></dl>');
		});

		return objOut.join('');
	};

	var LoggerUI = function(conf) {
		this.conf = XQCore.extend({
			'container': 'body'
		},conf);


	};

	LoggerUI.prototype.init = function() {
		this.ui = $(tmpl).appendTo(this.container);
		this.ui.css({

		});
	};

	LoggerUI.prototype.addLog = function() {
		var args = Array.prototype.slice.call(arguments);
		var type = args[0];
		var i;

		var html  = '<li data-type="' + type + '">';
			for(i = 1; i < args.length; i++) {
				html += '<span data-content-type"' + typeof(args[i]) + '">';

				switch(typeof args[i]) {
					case 'object':
						html += convertObject(args[i]);
						break;
					default:
						html += args[i];
						break;
				}

				html += '</span>';
			}
			html += '</li>';

		$(html).appendTo(this.ui);
	};

	return LoggerUI;
})();