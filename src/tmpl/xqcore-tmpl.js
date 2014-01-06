/*global define:false, FireTPL:false */
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
				if (FireTPL.templateCache && FireTPL.templateCache[viewName]) {
					return FireTPL.templateCache[viewName];
				}
				else {
					var tmpl = FireTPL.loadFile(XQCore.viewsDir.replace(/\/$/, '') + '/' + viewName + '.' + XQCore.viewExt.replace(/^\./, ''));
					return FireTPL.compile(tmpl);
				}
			}
		}
	};

	return XQCore;
}));
