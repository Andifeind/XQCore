if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
__$coverObject["webdocs/test/src/lib/xqcore-view.js"] = {};
__$coverObject["webdocs/test/src/lib/xqcore-view.js"].__code = "XQCore.View = (function() {\n\n\tvar view = function(presenter, conf) {\n\t\tvar self = this;\n\n\t\tconf = conf || {\n\t\t\tevents: null\n\t\t};\n\n\t\t$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());\n\t\tthis.name = (conf.name || 'Nameless') + 'View';\n\t\tthis.presenter = presenter;\n\n\t\tthis.debug = Boolean(conf.debug);\n\t\tthis.container = $(conf.container);\n\t\tif (this.container.length > 0) {\n\t\t\twindow.addEventListener('resize', function(e) {\n\t\t\t\tself.resize(e);\n\t\t\t}, false);\n\n\t\t\tthis.log('Initialize view with conf:', conf);\n\t\t\tthis.log('  ... using Presenter:', this.presenter.name);\n\t\t\tthis.log('  ... using Container:', this.container);\n\n\t\t\t//Send events to presenter\n\t\t\tif (this.events) {\n\t\t\t\tObject.keys(this.events).forEach(function(key) {\n\t\t\t\t\tvar split = key.split(' ', 2),\n\t\t\t\t\t\teventFunc,\n\t\t\t\t\t\teventName = split[0],\n\t\t\t\t\t\tselector = split[1] || null,\n\t\t\t\t\t\tself = this;\n\n\t\t\t\t\tif (split.length === 1 || split.length === 2) {\n\t\t\t\t\t\teventFunc = this.presenter.events[this.events[key]];\n\t\t\t\t\t\tif (typeof eventFunc === 'function') {\n\t\t\t\t\t\t\t//Register event listener\n\t\t\t\t\t\t\tthis.container.on(eventName, function(e) {\n\t\t\t\t\t\t\t\tvar formData = null,\n\t\t\t\t\t\t\t\t\ttagData = null;\n\n\t\t\t\t\t\t\t\tif (e.type === 'submit') {\n\t\t\t\t\t\t\t\t\tformData = XQCore.Util.serializeForm(e.target);\n\t\t\t\t\t\t\t\t\ttagData = $(e.target).data();\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\teventFunc.call(self.presenter, e, tagData, formData);\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\tthis.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);\n\t\t\t\t\t\t}\n\t\t\t\t\t\telse {\n\t\t\t\t\t\t\tthis.warn('Event handler callback not defined in Presenter:', this.events[key]);\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\telse {\n\t\t\t\t\t\tthis.warn('Incorect event configuration', key);\n\t\t\t\t\t}\n\t\t\t\t}, this);\n\t\t\t} else {\n\t\t\t\tthis.warn('No view events defined');\n\t\t\t}\n\n\t\t\t//Self init\n\t\t\tthis.init();\n\n\t\t\t//Call presenter.initView()\n\t\t\tthis.presenter.viewInit(this);\n\t\t}\n\t\telse {\n\t\t\tthis.error('Can\\'t initialize View, Container not found!', this.container);\n\t\t}\n\t};\n\n\tview.prototype.init = function() {\n\n\t};\n\n\tview.prototype.show = function() {\n\t\t\n\t};\n\n\tview.prototype.hide = function() {\n\t\t\n\t};\n\n\tview.prototype.render = function(data) {\n\t\tthis.log('Render view template', this.template, 'with data:', data);\n\t\tvar template = Handlebars.compile(this.template);\n\t\tthis.container.html(template(data));\n\t};\n\n\tview.prototype.resize = function() {\n\t\t\n\t};\n\n\n\n\treturn view;\n})();\n";
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["0:2360"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["30:1952"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["1956:1994"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["1998:2038"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["2042:2082"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["2086:2291"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["2295:2337"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["2343:2354"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["71:86"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["91:127"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["132:193"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["197:243"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["247:273"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["278:310"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["314:348"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["352:1948"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["388:468"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["474:518"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["523:578"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["583:633"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["669:1754"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["1775:1786"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["1823:1852"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["440:454"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["692:1696"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["746:874"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["882:1682"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["936:987"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["995:1602"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["1074:1385"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["1394:1485"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["1125:1169"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["1180:1311"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["1322:1374"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["1216:1262"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["1273:1301"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["1515:1594"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["1629:1675"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["1714:1749"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["1870:1944"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["2129:2196"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["2200:2248"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-view.js"]["2252:2287"] = 0;
__$coverObject['webdocs/test/src/lib/xqcore-view.js']['0:2360']++;
XQCore.View = function () {
    __$coverObject['webdocs/test/src/lib/xqcore-view.js']['30:1952']++;
    var view = function (presenter, conf) {
        __$coverObject['webdocs/test/src/lib/xqcore-view.js']['71:86']++;
        var self = this;
        __$coverObject['webdocs/test/src/lib/xqcore-view.js']['91:127']++;
        conf = conf || {events: null};
        __$coverObject['webdocs/test/src/lib/xqcore-view.js']['132:193']++;
        $.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
        __$coverObject['webdocs/test/src/lib/xqcore-view.js']['197:243']++;
        this.name = (conf.name || 'Nameless') + 'View';
        __$coverObject['webdocs/test/src/lib/xqcore-view.js']['247:273']++;
        this.presenter = presenter;
        __$coverObject['webdocs/test/src/lib/xqcore-view.js']['278:310']++;
        this.debug = Boolean(conf.debug);
        __$coverObject['webdocs/test/src/lib/xqcore-view.js']['314:348']++;
        this.container = $(conf.container);
        __$coverObject['webdocs/test/src/lib/xqcore-view.js']['352:1948']++;
        if (this.container.length > 0) {
            __$coverObject['webdocs/test/src/lib/xqcore-view.js']['388:468']++;
            window.addEventListener('resize', function (e) {
                __$coverObject['webdocs/test/src/lib/xqcore-view.js']['440:454']++;
                self.resize(e);
            }, false);
            __$coverObject['webdocs/test/src/lib/xqcore-view.js']['474:518']++;
            this.log('Initialize view with conf:', conf);
            __$coverObject['webdocs/test/src/lib/xqcore-view.js']['523:578']++;
            this.log('  ... using Presenter:', this.presenter.name);
            __$coverObject['webdocs/test/src/lib/xqcore-view.js']['583:633']++;
            this.log('  ... using Container:', this.container);
            __$coverObject['webdocs/test/src/lib/xqcore-view.js']['669:1754']++;
            if (this.events) {
                __$coverObject['webdocs/test/src/lib/xqcore-view.js']['692:1696']++;
                Object.keys(this.events).forEach(function (key) {
                    __$coverObject['webdocs/test/src/lib/xqcore-view.js']['746:874']++;
                    var split = key.split(' ', 2), eventFunc, eventName = split[0], selector = split[1] || null, self = this;
                    __$coverObject['webdocs/test/src/lib/xqcore-view.js']['882:1682']++;
                    if (split.length === 1 || split.length === 2) {
                        __$coverObject['webdocs/test/src/lib/xqcore-view.js']['936:987']++;
                        eventFunc = this.presenter.events[this.events[key]];
                        __$coverObject['webdocs/test/src/lib/xqcore-view.js']['995:1602']++;
                        if (typeof eventFunc === 'function') {
                            __$coverObject['webdocs/test/src/lib/xqcore-view.js']['1074:1385']++;
                            this.container.on(eventName, function (e) {
                                __$coverObject['webdocs/test/src/lib/xqcore-view.js']['1125:1169']++;
                                var formData = null, tagData = null;
                                __$coverObject['webdocs/test/src/lib/xqcore-view.js']['1180:1311']++;
                                if (e.type === 'submit') {
                                    __$coverObject['webdocs/test/src/lib/xqcore-view.js']['1216:1262']++;
                                    formData = XQCore.Util.serializeForm(e.target);
                                    __$coverObject['webdocs/test/src/lib/xqcore-view.js']['1273:1301']++;
                                    tagData = $(e.target).data();
                                }
                                __$coverObject['webdocs/test/src/lib/xqcore-view.js']['1322:1374']++;
                                eventFunc.call(self.presenter, e, tagData, formData);
                            });
                            __$coverObject['webdocs/test/src/lib/xqcore-view.js']['1394:1485']++;
                            this.log('Register Event:', eventName, 'on selector', selector, 'with callback', eventFunc);
                        } else {
                            __$coverObject['webdocs/test/src/lib/xqcore-view.js']['1515:1594']++;
                            this.warn('Event handler callback not defined in Presenter:', this.events[key]);
                        }
                    } else {
                        __$coverObject['webdocs/test/src/lib/xqcore-view.js']['1629:1675']++;
                        this.warn('Incorect event configuration', key);
                    }
                }, this);
            } else {
                __$coverObject['webdocs/test/src/lib/xqcore-view.js']['1714:1749']++;
                this.warn('No view events defined');
            }
            __$coverObject['webdocs/test/src/lib/xqcore-view.js']['1775:1786']++;
            this.init();
            __$coverObject['webdocs/test/src/lib/xqcore-view.js']['1823:1852']++;
            this.presenter.viewInit(this);
        } else {
            __$coverObject['webdocs/test/src/lib/xqcore-view.js']['1870:1944']++;
            this.error('Can\'t initialize View, Container not found!', this.container);
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore-view.js']['1956:1994']++;
    view.prototype.init = function () {
    };
    __$coverObject['webdocs/test/src/lib/xqcore-view.js']['1998:2038']++;
    view.prototype.show = function () {
    };
    __$coverObject['webdocs/test/src/lib/xqcore-view.js']['2042:2082']++;
    view.prototype.hide = function () {
    };
    __$coverObject['webdocs/test/src/lib/xqcore-view.js']['2086:2291']++;
    view.prototype.render = function (data) {
        __$coverObject['webdocs/test/src/lib/xqcore-view.js']['2129:2196']++;
        this.log('Render view template', this.template, 'with data:', data);
        __$coverObject['webdocs/test/src/lib/xqcore-view.js']['2200:2248']++;
        var template = Handlebars.compile(this.template);
        __$coverObject['webdocs/test/src/lib/xqcore-view.js']['2252:2287']++;
        this.container.html(template(data));
    };
    __$coverObject['webdocs/test/src/lib/xqcore-view.js']['2295:2337']++;
    view.prototype.resize = function () {
    };
    __$coverObject['webdocs/test/src/lib/xqcore-view.js']['2343:2354']++;
    return view;
}();