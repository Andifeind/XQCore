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
__$coverInit("webdocs/test/src/lib/xqcore-presenter.js", "XQCore.Presenter = (function() {\n\n\tvar presenter = function(conf) {\n\t\tvar self = this;\n\t\t\n\t\tthis.root = '/';\n\t\tthis.debug = false;\n\t\t\n\t\tconf = conf || {};\n\n\t\t$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Presenter';\n\t\tthis.eventCallbacks = {};\n\n\t\tthis.log('Initialize presenter with conf:', conf);\n\t\tthis.init();\n\n\t\t//Setup popstate listener\n\t\tif (conf.routes) {\n\t\t\tthis.Router = new XQCore.Router();\n\n\t\t\t//Add routes\n\t\t\tObject.keys(conf.routes).forEach(function(route) {\n\t\t\t\tvar callback = this.routes[route];\n\t\t\t\tif (typeof callback === 'string') {\n\t\t\t\t\tcallback = this[callback];\n\t\t\t\t}\n\n\t\t\t\tif (typeof callback === 'function') {\n\t\t\t\t\tthis.Router.addRoute(route, callback);\n\t\t\t\t}\n\t\t\t\telse {\n\t\t\t\t\tthis.warn('Router callback isn\\'t a function', callback, 'of route', route);\n\t\t\t\t}\n\t\t\t});\n\n\t\t\twindow.addEventListener('popstate', function(e) {\n\t\t\t\tself.log('popstate event recived', e);\n\t\t\t\tif (!e.state) {\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tvar tag = e.state.tag,\n\t\t\t\t\turl = e.state.url;\n\n\t\t\t\tif (typeof conf[tag] === 'function') {\n\t\t\t\t\tconf[tag].call(self, e.state.data);\n\t\t\t\t}\n\t\t\t}, false);\n\n\t\t\twindow.addEventListener('hashchange', function(e) {\n\t\t\t\tself.log('hashchange event recived', e, location.hash);\n\t\t\t\tvar tag = location.hash.substring(1);\n\n\t\t\t\tif (typeof conf[tag] === 'function') {\n\t\t\t\t\tself.log('Call func', conf[tag]);\n\t\t\t\t\tconf[tag].call(self);\n\t\t\t\t}\n\t\t\t}, false);\n\t\t}\n\t};\n\n\tpresenter.prototype.init = function() {\n\n\t};\n\n\t/**\n\t * Calling on view init\n\t *\n\t * @param {object} view The initializing view\n\t */\n\tpresenter.prototype.viewInit = function(view) {\n\n\t};\n\n\t/**\n\t * Add a history item to the browser history\n\t */\n\tpresenter.prototype.pushState = function(data, title, url) {\n\t\thistory.pushState(data,title,url);\n\t};\n\n\treturn presenter;\n})();\n");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "0:1809");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "35:1435");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1439:1482");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1572:1623");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1683:1783");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1787:1803");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "70:85");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "92:107");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "111:129");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "136:153");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "158:219");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "223:274");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "278:302");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "307:356");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "360:371");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "404:1431");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "426:459");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "481:846");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "852:1139");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1145:1427");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "536:569");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "575:647");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "654:839");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "616:641");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "697:734");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "758:833");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "906:943");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "949:982");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "989:1034");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1041:1125");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "970:976");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1085:1119");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1201:1255");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1261:1297");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1304:1413");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1348:1380");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1387:1407");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1746:1779");
__$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '0:1809');
XQCore.Presenter = function () {
    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '35:1435');
    var presenter = function (conf) {
        __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '70:85');
        var self = this;
        __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '92:107');
        this.root = '/';
        __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '111:129');
        this.debug = false;
        __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '136:153');
        conf = conf || {};
        __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '158:219');
        $.extend(this, conf, new XQCore.Event(), new XQCore.Logger());
        __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '223:274');
        this.name = (conf.name || 'Nameless') + 'Presenter';
        __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '278:302');
        this.eventCallbacks = {};
        __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '307:356');
        this.log('Initialize presenter with conf:', conf);
        __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '360:371');
        this.init();
        __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '404:1431');
        if (conf.routes) {
            __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '426:459');
            this.Router = new XQCore.Router();
            __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '481:846');
            Object.keys(conf.routes).forEach(function (route) {
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '536:569');
                var callback = this.routes[route];
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '575:647');
                if (typeof callback === 'string') {
                    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '616:641');
                    callback = this[callback];
                }
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '654:839');
                if (typeof callback === 'function') {
                    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '697:734');
                    this.Router.addRoute(route, callback);
                } else {
                    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '758:833');
                    this.warn('Router callback isn\'t a function', callback, 'of route', route);
                }
            });
            __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '852:1139');
            window.addEventListener('popstate', function (e) {
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '906:943');
                self.log('popstate event recived', e);
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '949:982');
                if (!e.state) {
                    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '970:976');
                    return;
                }
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '989:1034');
                var tag = e.state.tag, url = e.state.url;
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1041:1125');
                if (typeof conf[tag] === 'function') {
                    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1085:1119');
                    conf[tag].call(self, e.state.data);
                }
            }, false);
            __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1145:1427');
            window.addEventListener('hashchange', function (e) {
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1201:1255');
                self.log('hashchange event recived', e, location.hash);
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1261:1297');
                var tag = location.hash.substring(1);
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1304:1413');
                if (typeof conf[tag] === 'function') {
                    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1348:1380');
                    self.log('Call func', conf[tag]);
                    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1387:1407');
                    conf[tag].call(self);
                }
            }, false);
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1439:1482');
    presenter.prototype.init = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1572:1623');
    presenter.prototype.viewInit = function (view) {
    };
    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1683:1783');
    presenter.prototype.pushState = function (data, title, url) {
        __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1746:1779');
        history.pushState(data, title, url);
    };
    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1787:1803');
    return presenter;
}();