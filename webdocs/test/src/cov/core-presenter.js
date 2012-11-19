if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
__$coverObject["webdocs/test/src/lib/core-presenter.js"] = {};
__$coverObject["webdocs/test/src/lib/core-presenter.js"].__code = "var CorePresenter = (function() {\n\n\tvar presenter = function(conf) {\n\t\t$.extend(this, conf, new CoreEvent(), new CoreLogger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Presenter';\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.eventCallbacks = {};\n\n\t\tthis.log('Initialize presenter with conf:', conf);\n\t\tthis.init();\n\t};\n\n\tpresenter.prototype.init = function() {\n\n\t};\n\n\treturn presenter;\n})();";
__$coverObject["webdocs/test/src/lib/core-presenter.js"]["0:391"] = 0;
__$coverObject["webdocs/test/src/lib/core-presenter.js"]["36:318"] = 0;
__$coverObject["webdocs/test/src/lib/core-presenter.js"]["322:365"] = 0;
__$coverObject["webdocs/test/src/lib/core-presenter.js"]["369:385"] = 0;
__$coverObject["webdocs/test/src/lib/core-presenter.js"]["71:126"] = 0;
__$coverObject["webdocs/test/src/lib/core-presenter.js"]["130:181"] = 0;
__$coverObject["webdocs/test/src/lib/core-presenter.js"]["185:217"] = 0;
__$coverObject["webdocs/test/src/lib/core-presenter.js"]["221:245"] = 0;
__$coverObject["webdocs/test/src/lib/core-presenter.js"]["250:299"] = 0;
__$coverObject["webdocs/test/src/lib/core-presenter.js"]["303:314"] = 0;
__$coverObject['webdocs/test/src/lib/core-presenter.js']['0:391']++;
var CorePresenter = function () {
        __$coverObject['webdocs/test/src/lib/core-presenter.js']['36:318']++;
        var presenter = function (conf) {
            __$coverObject['webdocs/test/src/lib/core-presenter.js']['71:126']++;
            $.extend(this, conf, new CoreEvent(), new CoreLogger());
            __$coverObject['webdocs/test/src/lib/core-presenter.js']['130:181']++;
            this.name = (conf.name || 'Nameless') + 'Presenter';
            __$coverObject['webdocs/test/src/lib/core-presenter.js']['185:217']++;
            this.debug = Boolean(conf.debug);
            __$coverObject['webdocs/test/src/lib/core-presenter.js']['221:245']++;
            this.eventCallbacks = {};
            __$coverObject['webdocs/test/src/lib/core-presenter.js']['250:299']++;
            this.log('Initialize presenter with conf:', conf);
            __$coverObject['webdocs/test/src/lib/core-presenter.js']['303:314']++;
            this.init();
        };
        __$coverObject['webdocs/test/src/lib/core-presenter.js']['322:365']++;
        presenter.prototype.init = function () {
        };
        __$coverObject['webdocs/test/src/lib/core-presenter.js']['369:385']++;
        return presenter;
    }();