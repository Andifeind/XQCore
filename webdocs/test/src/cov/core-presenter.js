if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
var __$coverInit = function(name, code){
	__$coverObject[name] = {__code: code}
}
var __$coverInitRange = function(name, range){
	__$coverObject[name][range] = 0;
}
var __$coverCall = function(name, range){
	__$coverObject[name][range]++;
}
__$coverInit("webdocs/test/src/lib/core-presenter.js", "var CorePresenter = (function() {\n\n\tvar presenter = function(conf) {\n\t\t$.extend(this, conf, new CoreEvent(), new CoreLogger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Presenter';\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.eventCallbacks = {};\n\n\t\tthis.log('Initialize presenter with conf:', conf);\n\t\tthis.init();\n\t};\n\n\tpresenter.prototype.init = function() {\n\n\t};\n\n\treturn presenter;\n})();");
__$coverInitRange("webdocs/test/src/lib/core-presenter.js", "0:391");
__$coverInitRange("webdocs/test/src/lib/core-presenter.js", "36:318");
__$coverInitRange("webdocs/test/src/lib/core-presenter.js", "322:365");
__$coverInitRange("webdocs/test/src/lib/core-presenter.js", "369:385");
__$coverInitRange("webdocs/test/src/lib/core-presenter.js", "71:126");
__$coverInitRange("webdocs/test/src/lib/core-presenter.js", "130:181");
__$coverInitRange("webdocs/test/src/lib/core-presenter.js", "185:217");
__$coverInitRange("webdocs/test/src/lib/core-presenter.js", "221:245");
__$coverInitRange("webdocs/test/src/lib/core-presenter.js", "250:299");
__$coverInitRange("webdocs/test/src/lib/core-presenter.js", "303:314");
__$coverCall('webdocs/test/src/lib/core-presenter.js', '0:391');
var CorePresenter = function () {
        __$coverCall('webdocs/test/src/lib/core-presenter.js', '36:318');
        var presenter = function (conf) {
            __$coverCall('webdocs/test/src/lib/core-presenter.js', '71:126');
            $.extend(this, conf, new CoreEvent(), new CoreLogger());
            __$coverCall('webdocs/test/src/lib/core-presenter.js', '130:181');
            this.name = (conf.name || 'Nameless') + 'Presenter';
            __$coverCall('webdocs/test/src/lib/core-presenter.js', '185:217');
            this.debug = Boolean(conf.debug);
            __$coverCall('webdocs/test/src/lib/core-presenter.js', '221:245');
            this.eventCallbacks = {};
            __$coverCall('webdocs/test/src/lib/core-presenter.js', '250:299');
            this.log('Initialize presenter with conf:', conf);
            __$coverCall('webdocs/test/src/lib/core-presenter.js', '303:314');
            this.init();
        };
        __$coverCall('webdocs/test/src/lib/core-presenter.js', '322:365');
        presenter.prototype.init = function () {
        };
        __$coverCall('webdocs/test/src/lib/core-presenter.js', '369:385');
        return presenter;
    }();