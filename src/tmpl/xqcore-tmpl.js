/*global define:false */
(function (root, factory) {
	'use strict';

	if (typeof define === 'function' && define.amd) {
		define('xqcore', [XQCore.templateEngine], factory);
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory(require(XQCore.templateEngine));
	} else {
		var engine = XQCore.templateEngine === 'firetpl' ? 'FireTPL' : 'Handlebars';
		root.XQCore = factory(root[engine]);
	}

}(this, function (TemplateEngine) {
	'use strict';

	XQCore.Tmpl = {
		type: XQCore.templateEngine,
		compile: TemplateEngine.compile,
		getTemplate: function(viewName) {
			if (XQCore.templateEngine === 'firetpl') {
				var FireTPL = TemplateEngine;
				if (FireTPL.templateCache && FireTPL.templateCache[viewName]) {
					return FireTPL.templateCache[viewName];
				}
				else if(!FireTPL.loadFile) {
					throw new Error('FireTPL runtime is being used. Please preload the ' + viewName + 'View');
				}
				else {
					var tmpl = FireTPL.readFile(XQCore.viewsDir.replace(/\/$/, '') + '/' + viewName + '.' + XQCore.viewExt.replace(/^\./, ''));
					return FireTPL.compile(tmpl, {
						eventTags: true
					});
				}
			}
		}
	};

	return XQCore;
}));
