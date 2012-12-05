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
__$coverInit("webdocs/test/src/lib/xqcore-presenter.js", "XQCore.Presenter = (function() {\n\n\tvar presenter = function(conf) {\n\t\tvar self = this;\n\t\t\n\t\tthis.root = '/';\n\t\tthis.debug = false;\n\t\t\n\t\tconf = conf || {};\n\n\t\t$.extend(this, conf, new XQCore.Event(), new XQCore.Logger());\n\t\tthis.name = (conf.name || 'Nameless') + 'Presenter';\n\t\tthis.eventCallbacks = {};\n\n\t\tthis.log('Initialize presenter with conf:', conf);\n\t\tthis.init();\n\n\t\t//Setup popstate listener\n\t\tif (conf.routes) {\n\t\t\twindow.addEventListener('popstate', function(e) {\n\t\t\t\tself.log('popstate event recived', e);\n\t\t\t\tif (!e.state) {\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tvar tag = e.state.tag,\n\t\t\t\t\turl = e.state.url;\n\n\t\t\t\tif (typeof conf[tag] === 'function') {\n\t\t\t\t\tconf[tag].call(self, e.state.data);\n\t\t\t\t}\n\t\t\t}, false);\n\n\t\t\twindow.addEventListener('hashchange', function(e) {\n\t\t\t\tself.log('hashchange event recived', e, location.hash);\n\t\t\t\tvar tag = location.hash.substring(1);\n\n\t\t\t\tif (typeof conf[tag] === 'function') {\n\t\t\t\t\tself.log('Call func', conf[tag]);\n\t\t\t\t\tconf[tag].call(self);\n\t\t\t\t}\n\t\t\t}, false);\n\t\t}\n\t};\n\n\tpresenter.prototype.init = function() {\n\n\t};\n\n\t/**\n\t * Calling on view init\n\t *\n\t * @param {object} view The initializing view\n\t */\n\tpresenter.prototype.viewInit = function(view) {\n\n\t};\n\n\t/**\n\t * Add a history item to the browser history\n\t */\n\tpresenter.prototype.pushState = function(data, title, url) {\n\t\thistory.pushState(data,title,url);\n\t};\n\n\treturn presenter;\n})();\n");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "0:1383");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "35:1009");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1013:1056");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1146:1197");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1257:1357");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1361:1377");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "70:85");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "92:107");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "111:129");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "136:153");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "158:219");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "223:274");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "278:302");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "307:356");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "360:371");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "404:1005");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "426:713");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "719:1001");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "480:517");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "523:556");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "563:608");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "615:699");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "544:550");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "659:693");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "775:829");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "835:871");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "878:987");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "922:954");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "961:981");
__$coverInitRange("webdocs/test/src/lib/xqcore-presenter.js", "1320:1353");
__$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '0:1383');
XQCore.Presenter = function () {
    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '35:1009');
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
        __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '404:1005');
        if (conf.routes) {
            __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '426:713');
            window.addEventListener('popstate', function (e) {
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '480:517');
                self.log('popstate event recived', e);
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '523:556');
                if (!e.state) {
                    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '544:550');
                    return;
                }
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '563:608');
                var tag = e.state.tag, url = e.state.url;
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '615:699');
                if (typeof conf[tag] === 'function') {
                    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '659:693');
                    conf[tag].call(self, e.state.data);
                }
            }, false);
            __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '719:1001');
            window.addEventListener('hashchange', function (e) {
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '775:829');
                self.log('hashchange event recived', e, location.hash);
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '835:871');
                var tag = location.hash.substring(1);
                __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '878:987');
                if (typeof conf[tag] === 'function') {
                    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '922:954');
                    self.log('Call func', conf[tag]);
                    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '961:981');
                    conf[tag].call(self);
                }
            }, false);
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1013:1056');
    presenter.prototype.init = function () {
    };
    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1146:1197');
    presenter.prototype.viewInit = function (view) {
    };
    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1257:1357');
    presenter.prototype.pushState = function (data, title, url) {
        __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1320:1353');
        history.pushState(data, title, url);
    };
    __$coverCall('webdocs/test/src/lib/xqcore-presenter.js', '1361:1377');
    return presenter;
}();