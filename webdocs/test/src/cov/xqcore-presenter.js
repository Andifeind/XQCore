if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"] = {};
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"].__code = "XQCore.Presenter = (function() {\n\n\tvar presenter = function(conf) {\n\t\tvar self = this;\n\t\t\n\t\tthis.root = '/';\n\t\tthis.debug = false;\n\t\t\n\t\tconf = conf || {};\n\n\t\t$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Presenter';\n\t\tthis.eventCallbacks = {};\n\n\t\tthis.log('Initialize presenter with conf:', conf);\n\t\tthis.init();\n\n\t\t//Setup popstate listener\n\t\tif (conf.routes) {\n\t\t\twindow.addEventListener('popstate', function(e) {\n\t\t\t\tself.log('popstate event recived', e);\n\t\t\t\tif (!e.state) {\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tvar tag = e.state.tag,\n\t\t\t\t\turl = e.state.url;\n\n\t\t\t\tif (typeof conf[tag] === 'function') {\n\t\t\t\t\tconf[tag].call(self, e.state.data);\n\t\t\t\t}\n\t\t\t}, false);\n\n\t\t\twindow.addEventListener('hashchange', function(e) {\n\t\t\t\tself.log('hashchange event recived', e, location.hash);\n\t\t\t\tvar tag = location.hash.substring(1);\n\n\t\t\t\tif (typeof conf[tag] === 'function') {\n\t\t\t\t\tself.log('Call func', conf[tag]);\n\t\t\t\t\tconf[tag].call(self);\n\t\t\t\t}\n\t\t\t}, false);\n\t\t}\n\t};\n\n\tpresenter.prototype.init = function() {\n\n\t};\n\n\t/**\n\t * Calling on view init\n\t *\n\t * @param {object} view The initializing view\n\t */\n\tpresenter.prototype.viewInit = function(view) {\n\n\t};\n\n\t/**\n\t * Add a history item to the browser history\n\t */\n\tpresenter.prototype.pushState = function(data, title, url) {\n\t\thistory.pushState(data,title,url);\n\t};\n\n\treturn presenter;\n})();\n";
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["0:1383"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["35:1009"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["1013:1056"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["1146:1197"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["1257:1357"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["1361:1377"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["70:85"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["92:107"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["111:129"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["136:153"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["158:219"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["223:274"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["278:302"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["307:356"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["360:371"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["404:1005"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["426:713"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["719:1001"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["480:517"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["523:556"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["563:608"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["615:699"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["544:550"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["659:693"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["775:829"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["835:871"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["878:987"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["922:954"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["961:981"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-presenter.js"]["1320:1353"] = 0;
__$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['0:1383']++;
XQCore.Presenter = function () {
    __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['35:1009']++;
    var presenter = function (conf) {
        __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['70:85']++;
        var self = this;
        __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['92:107']++;
        this.root = '/';
        __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['111:129']++;
        this.debug = false;
        __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['136:153']++;
        conf = conf || {};
        __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['158:219']++;
        $.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
        __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['223:274']++;
        this.name = (conf.name || 'Nameless') + 'Presenter';
        __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['278:302']++;
        this.eventCallbacks = {};
        __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['307:356']++;
        this.log('Initialize presenter with conf:', conf);
        __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['360:371']++;
        this.init();
        __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['404:1005']++;
        if (conf.routes) {
            __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['426:713']++;
            window.addEventListener('popstate', function (e) {
                __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['480:517']++;
                self.log('popstate event recived', e);
                __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['523:556']++;
                if (!e.state) {
                    __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['544:550']++;
                    return;
                }
                __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['563:608']++;
                var tag = e.state.tag, url = e.state.url;
                __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['615:699']++;
                if (typeof conf[tag] === 'function') {
                    __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['659:693']++;
                    conf[tag].call(self, e.state.data);
                }
            }, false);
            __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['719:1001']++;
            window.addEventListener('hashchange', function (e) {
                __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['775:829']++;
                self.log('hashchange event recived', e, location.hash);
                __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['835:871']++;
                var tag = location.hash.substring(1);
                __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['878:987']++;
                if (typeof conf[tag] === 'function') {
                    __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['922:954']++;
                    self.log('Call func', conf[tag]);
                    __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['961:981']++;
                    conf[tag].call(self);
                }
            }, false);
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['1013:1056']++;
    presenter.prototype.init = function () {
    };
    __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['1146:1197']++;
    presenter.prototype.viewInit = function (view) {
    };
    __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['1257:1357']++;
    presenter.prototype.pushState = function (data, title, url) {
        __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['1320:1353']++;
        history.pushState(data, title, url);
    };
    __$coverObject['webdocs/test/src/lib/xqcore-presenter.js']['1361:1377']++;
    return presenter;
}();