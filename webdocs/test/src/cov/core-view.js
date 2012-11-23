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
__$coverInit("webdocs/test/src/lib/core-view.js", "var CoreView = (function() {\n\n\tvar view = function(presenter, conf) {\n\t\tvar self = this;\n\n\t\t$.extend(this, conf, new CoreEvent(), new CoreLogger());\n\t\tthis.name = (conf.name || 'Nameless') + 'View';\n\t\tthis.presenter = presenter;\n\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.container = $(conf.container);\n\t\tif (this.container.length > 0) {\n\t\t\twindow.addEventListener('resize', function(e) {\n\t\t\t\tself.resize(e);\n\t\t\t}, false);\n\n\t\t\tthis.log('Initialize view with conf:', conf);\n\t\t\tthis.log('  ... using Presenter:', this.presenter.name);\n\t\t\tthis.log('  ... using Container:', this.container);\n\n\t\t\t//Send events to presenter\n\t\t\tObject.keys(this.events).forEach(function(key) {\n\t\t\t\tvar split = key.split(' ', 2),\n\t\t\t\t\teventFunc,\n\t\t\t\t\teventName = split[0],\n\t\t\t\t\tselector = split[1] || null;\n\n\t\t\t\tif (split.length === 1 || split.length === 2) {\n\t\t\t\t\teventFunc = this.presenter.events[this.events[key]];\n\t\t\t\t\tif (typeof eventFunc === 'function') {\n\t\t\t\t\t\t//Register event listener\n\t\t\t\t\t\tthis.container.on(eventName, eventFunc);\n\t\t\t\t\t\tthis.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);\n\t\t\t\t\t}\n\t\t\t\t\telse {\n\t\t\t\t\t\tthis.warn('Event handler callback not defined in Presenter:', this.events[key]);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\telse {\n\t\t\t\t\tthis.warn('Incorect event configuration', key);\n\t\t\t\t}\n\t\t\t}, this);\n\n\t\t\t//Self init\n\t\t\tthis.init();\n\t\t}\n\t\telse {\n\t\t\tthis.error('Can\\'t initialize View, Container not found!', this.container);\n\t\t}\n\t};\n\n\tview.prototype.init = function() {\n\n\t};\n\n\tview.prototype.show = function() {\n\t\t\n\t};\n\n\tview.prototype.hide = function() {\n\t\t\n\t};\n\n\tview.prototype.render = function() {\n\t\t\n\t};\n\n\tview.prototype.resize = function() {\n\t\t\n\t};\n\n\n\n\treturn view;\n})();");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "0:1694");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "31:1449");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "1453:1491");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "1495:1535");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "1539:1579");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "1583:1625");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "1629:1671");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "1677:1688");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "72:87");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "92:147");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "151:197");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "201:227");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "232:264");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "268:302");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "306:1445");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "342:422");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "428:472");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "477:532");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "537:587");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "623:1317");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "1338:1349");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "394:408");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "676:782");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "789:1304");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "842:893");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "900:1228");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "977:1016");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "1024:1115");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "1142:1221");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "1252:1298");
__$coverInitRange("webdocs/test/src/lib/core-view.js", "1367:1441");
__$coverCall('webdocs/test/src/lib/core-view.js', '0:1694');
var CoreView = function () {
        __$coverCall('webdocs/test/src/lib/core-view.js', '31:1449');
        var view = function (presenter, conf) {
            __$coverCall('webdocs/test/src/lib/core-view.js', '72:87');
            var self = this;
            __$coverCall('webdocs/test/src/lib/core-view.js', '92:147');
            $.extend(this, conf, new CoreEvent(), new CoreLogger());
            __$coverCall('webdocs/test/src/lib/core-view.js', '151:197');
            this.name = (conf.name || 'Nameless') + 'View';
            __$coverCall('webdocs/test/src/lib/core-view.js', '201:227');
            this.presenter = presenter;
            __$coverCall('webdocs/test/src/lib/core-view.js', '232:264');
            this.debug = Boolean(conf.debug);
            __$coverCall('webdocs/test/src/lib/core-view.js', '268:302');
            this.container = $(conf.container);
            __$coverCall('webdocs/test/src/lib/core-view.js', '306:1445');
            if (this.container.length > 0) {
                __$coverCall('webdocs/test/src/lib/core-view.js', '342:422');
                window.addEventListener('resize', function (e) {
                    __$coverCall('webdocs/test/src/lib/core-view.js', '394:408');
                    self.resize(e);
                }, false);
                __$coverCall('webdocs/test/src/lib/core-view.js', '428:472');
                this.log('Initialize view with conf:', conf);
                __$coverCall('webdocs/test/src/lib/core-view.js', '477:532');
                this.log('  ... using Presenter:', this.presenter.name);
                __$coverCall('webdocs/test/src/lib/core-view.js', '537:587');
                this.log('  ... using Container:', this.container);
                __$coverCall('webdocs/test/src/lib/core-view.js', '623:1317');
                Object.keys(this.events).forEach(function (key) {
                    __$coverCall('webdocs/test/src/lib/core-view.js', '676:782');
                    var split = key.split(' ', 2), eventFunc, eventName = split[0], selector = split[1] || null;
                    __$coverCall('webdocs/test/src/lib/core-view.js', '789:1304');
                    if (split.length === 1 || split.length === 2) {
                        __$coverCall('webdocs/test/src/lib/core-view.js', '842:893');
                        eventFunc = this.presenter.events[this.events[key]];
                        __$coverCall('webdocs/test/src/lib/core-view.js', '900:1228');
                        if (typeof eventFunc === 'function') {
                            __$coverCall('webdocs/test/src/lib/core-view.js', '977:1016');
                            this.container.on(eventName, eventFunc);
                            __$coverCall('webdocs/test/src/lib/core-view.js', '1024:1115');
                            this.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);
                        } else {
                            __$coverCall('webdocs/test/src/lib/core-view.js', '1142:1221');
                            this.warn('Event handler callback not defined in Presenter:', this.events[key]);
                        }
                    } else {
                        __$coverCall('webdocs/test/src/lib/core-view.js', '1252:1298');
                        this.warn('Incorect event configuration', key);
                    }
                }, this);
                __$coverCall('webdocs/test/src/lib/core-view.js', '1338:1349');
                this.init();
            } else {
                __$coverCall('webdocs/test/src/lib/core-view.js', '1367:1441');
                this.error('Can\'t initialize View, Container not found!', this.container);
            }
        };
        __$coverCall('webdocs/test/src/lib/core-view.js', '1453:1491');
        view.prototype.init = function () {
        };
        __$coverCall('webdocs/test/src/lib/core-view.js', '1495:1535');
        view.prototype.show = function () {
        };
        __$coverCall('webdocs/test/src/lib/core-view.js', '1539:1579');
        view.prototype.hide = function () {
        };
        __$coverCall('webdocs/test/src/lib/core-view.js', '1583:1625');
        view.prototype.render = function () {
        };
        __$coverCall('webdocs/test/src/lib/core-view.js', '1629:1671');
        view.prototype.resize = function () {
        };
        __$coverCall('webdocs/test/src/lib/core-view.js', '1677:1688');
        return view;
    }();