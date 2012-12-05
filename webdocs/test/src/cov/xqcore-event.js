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
__$coverInit("webdocs/test/src/lib/xqcore-event.js", "XQCore.Event = (function() {\n\tvar ee,\n\t\tevent;\n\t\n\tfunction indexOf(eventName, callback) {\n\t\tthis.objectName = 'XQCore.Event';\n\t\t\n\t\tvar len = this.store.length,\n\t\t\ti = 0,\n\t\t\tel;\n\n\t\tfor (; i < len; i++) {\n\t\t\tel = this.store[i];\n\t\t\tif (eventName === null || eventName === el.event && callback === null || callback === el.callback) {\n\t\t\t\treturn el;\n\t\t\t}\n\t\t}\n\n\t\treturn null;\n\t}\n\n\n\tevent = function(conf) {\n\t\tthis.store = [];\n\t};\n\n\t// event.prototype.on = function(eventName, callback) {\n\n\t// };\n\n\t// event.prototype.once = function(eventName, callback) {\n\n\t// };\n\n\t// event.prototype.emit = function(eventName, data) {\n\n\t// };\n\n\t// event.prototype.remove = function(eventName, callback) {\n\n\t// };\n\n\tee = new EventEmitter();\n\tevent.prototype.emit = function(eventName, data) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('XQCore - Emit event', eventName, data);\n\t\t}\n\t\treturn ee.emitEvent(eventName, [data]);\n\t};\n\n\tevent.prototype.on = function(eventName, listener) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('XQCore - Add listener', eventName, listener);\n\t\t}\n\t\treturn ee.addListener(eventName, listener);\n\t};\n\n\tevent.prototype.once = function(eventName, listener) {\n\t\tvar onceListener = function() {\n\t\t\tee.removeListener(eventName, listener);\n\t\t\tlistener.call(null, arguments);\n\t\t\treturn true;\n\t\t};\n\n\t\tif (this.debug) {\n\t\t\tconsole.debug('XQCore - Add once listener', eventName, listener);\n\t\t}\n\t\treturn ee.addListener(eventName, onceListener);\n\t};\n\n\tevent.prototype.off = function(eventName, listener) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('XQCore - Remove listener', eventName, listener);\n\t\t}\n\n\t\tif (listener === undefined) {\n\t\t\treturn ee.removeEvent(eventName);\n\t\t}\n\t\telse {\n\t\t\treturn ee.removeListener(eventName, listener);\n\t\t}\n\t};\n\n\treturn event;\n})();\n");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "0:1738");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "30:45");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "50:371");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "376:422");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "694:717");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "720:897");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "901:1090");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "1094:1428");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "1432:1716");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "1720:1732");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "92:124");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "131:175");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "180:352");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "357:368");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "206:224");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "229:348");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "334:343");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "403:418");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "773:851");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "855:893");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "794:847");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "956:1040");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "1044:1086");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "977:1036");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "1151:1280");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "1285:1374");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "1378:1424");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "1186:1224");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "1229:1259");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "1264:1275");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "1306:1370");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "1488:1575");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "1580:1712");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "1509:1571");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "1613:1645");
__$coverInitRange("webdocs/test/src/lib/xqcore-event.js", "1663:1708");
__$coverCall('webdocs/test/src/lib/xqcore-event.js', '0:1738');
XQCore.Event = function () {
    __$coverCall('webdocs/test/src/lib/xqcore-event.js', '30:45');
    var ee, event;
    __$coverCall('webdocs/test/src/lib/xqcore-event.js', '50:371');
    function indexOf(eventName, callback) {
        __$coverCall('webdocs/test/src/lib/xqcore-event.js', '92:124');
        this.objectName = 'XQCore.Event';
        __$coverCall('webdocs/test/src/lib/xqcore-event.js', '131:175');
        var len = this.store.length, i = 0, el;
        __$coverCall('webdocs/test/src/lib/xqcore-event.js', '180:352');
        for (; i < len; i++) {
            __$coverCall('webdocs/test/src/lib/xqcore-event.js', '206:224');
            el = this.store[i];
            __$coverCall('webdocs/test/src/lib/xqcore-event.js', '229:348');
            if (eventName === null || eventName === el.event && callback === null || callback === el.callback) {
                __$coverCall('webdocs/test/src/lib/xqcore-event.js', '334:343');
                return el;
            }
        }
        __$coverCall('webdocs/test/src/lib/xqcore-event.js', '357:368');
        return null;
    }
    __$coverCall('webdocs/test/src/lib/xqcore-event.js', '376:422');
    event = function (conf) {
        __$coverCall('webdocs/test/src/lib/xqcore-event.js', '403:418');
        this.store = [];
    };
    __$coverCall('webdocs/test/src/lib/xqcore-event.js', '694:717');
    ee = new EventEmitter();
    __$coverCall('webdocs/test/src/lib/xqcore-event.js', '720:897');
    event.prototype.emit = function (eventName, data) {
        __$coverCall('webdocs/test/src/lib/xqcore-event.js', '773:851');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore-event.js', '794:847');
            console.debug('XQCore - Emit event', eventName, data);
        }
        __$coverCall('webdocs/test/src/lib/xqcore-event.js', '855:893');
        return ee.emitEvent(eventName, [data]);
    };
    __$coverCall('webdocs/test/src/lib/xqcore-event.js', '901:1090');
    event.prototype.on = function (eventName, listener) {
        __$coverCall('webdocs/test/src/lib/xqcore-event.js', '956:1040');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore-event.js', '977:1036');
            console.debug('XQCore - Add listener', eventName, listener);
        }
        __$coverCall('webdocs/test/src/lib/xqcore-event.js', '1044:1086');
        return ee.addListener(eventName, listener);
    };
    __$coverCall('webdocs/test/src/lib/xqcore-event.js', '1094:1428');
    event.prototype.once = function (eventName, listener) {
        __$coverCall('webdocs/test/src/lib/xqcore-event.js', '1151:1280');
        var onceListener = function () {
            __$coverCall('webdocs/test/src/lib/xqcore-event.js', '1186:1224');
            ee.removeListener(eventName, listener);
            __$coverCall('webdocs/test/src/lib/xqcore-event.js', '1229:1259');
            listener.call(null, arguments);
            __$coverCall('webdocs/test/src/lib/xqcore-event.js', '1264:1275');
            return true;
        };
        __$coverCall('webdocs/test/src/lib/xqcore-event.js', '1285:1374');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore-event.js', '1306:1370');
            console.debug('XQCore - Add once listener', eventName, listener);
        }
        __$coverCall('webdocs/test/src/lib/xqcore-event.js', '1378:1424');
        return ee.addListener(eventName, onceListener);
    };
    __$coverCall('webdocs/test/src/lib/xqcore-event.js', '1432:1716');
    event.prototype.off = function (eventName, listener) {
        __$coverCall('webdocs/test/src/lib/xqcore-event.js', '1488:1575');
        if (this.debug) {
            __$coverCall('webdocs/test/src/lib/xqcore-event.js', '1509:1571');
            console.debug('XQCore - Remove listener', eventName, listener);
        }
        __$coverCall('webdocs/test/src/lib/xqcore-event.js', '1580:1712');
        if (listener === undefined) {
            __$coverCall('webdocs/test/src/lib/xqcore-event.js', '1613:1645');
            return ee.removeEvent(eventName);
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore-event.js', '1663:1708');
            return ee.removeListener(eventName, listener);
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore-event.js', '1720:1732');
    return event;
}();