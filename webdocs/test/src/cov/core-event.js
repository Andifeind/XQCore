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
__$coverInit("webdocs/test/src/lib/core-event.js", "var CoreEvent = (function() {\n\tvar ee,\n\t\tevent;\n\t\n\tfunction indexOf(eventName, callback) {\n\t\tthis.objectName = 'CoreEvent';\n\t\t\n\t\tvar len = this.store.length,\n\t\t\ti = 0,\n\t\t\tel;\n\n\t\tfor (; i < len; i++) {\n\t\t\tel = this.store[i];\n\t\t\tif (eventName === null || eventName === el.event && callback === null || callback === el.callback) {\n\t\t\t\treturn el;\n\t\t\t}\n\t\t}\n\n\t\treturn null;\n\t}\n\n\n\tevent = function(conf) {\n\t\tthis.store = [];\n\t};\n\n\t// event.prototype.on = function(eventName, callback) {\n\n\t// };\n\n\t// event.prototype.once = function(eventName, callback) {\n\n\t// };\n\n\t// event.prototype.emit = function(eventName, data) {\n\n\t// };\n\n\t// event.prototype.remove = function(eventName, callback) {\n\n\t// };\n\n\tee = new EventEmitter();\n\tevent.prototype.emit = function(eventName, data) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('Akonda Core - Emit event', eventName, data);\n\t\t}\n\t\treturn ee.emitEvent(eventName, [data]);\n\t};\n\n\tevent.prototype.on = function(eventName, listener) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('Akonda Core - Add listener', eventName, listener);\n\t\t}\n\t\treturn ee.addListener(eventName, listener);\n\t};\n\n\tevent.prototype.once = function(eventName, listener) {\n\t\tvar onceListener = function() {\n\t\t\tee.removeListener(eventName, listener);\n\t\t\tlistener.call(null, arguments);\n\t\t\treturn true;\n\t\t};\n\n\t\tif (this.debug) {\n\t\t\tconsole.debug('Akonda Core - Add once listener', eventName, listener);\n\t\t}\n\t\treturn ee.addListener(eventName, onceListener);\n\t};\n\n\tevent.prototype.off = function(eventName, listener) {\n\t\tif (this.debug) {\n\t\t\tconsole.debug('Akonda Core - Remove listener', eventName, listener);\n\t\t}\n\n\t\tif (listener === undefined) {\n\t\t\treturn ee.removeEvent(eventName);\n\t\t}\n\t\telse {\n\t\t\treturn ee.removeListener(eventName, listener);\n\t\t}\n\t};\n\n\treturn event;\n})();\n");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "0:1756");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "31:46");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "51:369");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "374:420");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "692:715");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "718:900");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "904:1098");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "1102:1441");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "1445:1734");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "1738:1750");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "93:122");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "129:173");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "178:350");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "355:366");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "204:222");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "227:346");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "332:341");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "401:416");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "771:854");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "858:896");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "792:850");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "959:1048");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "1052:1094");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "980:1044");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "1159:1288");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "1293:1387");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "1391:1437");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "1194:1232");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "1237:1267");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "1272:1283");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "1314:1383");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "1501:1593");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "1598:1730");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "1522:1589");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "1631:1663");
__$coverInitRange("webdocs/test/src/lib/core-event.js", "1681:1726");
__$coverCall('webdocs/test/src/lib/core-event.js', '0:1756');
var CoreEvent = function () {
        __$coverCall('webdocs/test/src/lib/core-event.js', '31:46');
        var ee, event;
        __$coverCall('webdocs/test/src/lib/core-event.js', '51:369');
        function indexOf(eventName, callback) {
            __$coverCall('webdocs/test/src/lib/core-event.js', '93:122');
            this.objectName = 'CoreEvent';
            __$coverCall('webdocs/test/src/lib/core-event.js', '129:173');
            var len = this.store.length, i = 0, el;
            __$coverCall('webdocs/test/src/lib/core-event.js', '178:350');
            for (; i < len; i++) {
                __$coverCall('webdocs/test/src/lib/core-event.js', '204:222');
                el = this.store[i];
                __$coverCall('webdocs/test/src/lib/core-event.js', '227:346');
                if (eventName === null || eventName === el.event && callback === null || callback === el.callback) {
                    __$coverCall('webdocs/test/src/lib/core-event.js', '332:341');
                    return el;
                }
            }
            __$coverCall('webdocs/test/src/lib/core-event.js', '355:366');
            return null;
        }
        __$coverCall('webdocs/test/src/lib/core-event.js', '374:420');
        event = function (conf) {
            __$coverCall('webdocs/test/src/lib/core-event.js', '401:416');
            this.store = [];
        };
        __$coverCall('webdocs/test/src/lib/core-event.js', '692:715');
        ee = new EventEmitter();
        __$coverCall('webdocs/test/src/lib/core-event.js', '718:900');
        event.prototype.emit = function (eventName, data) {
            __$coverCall('webdocs/test/src/lib/core-event.js', '771:854');
            if (this.debug) {
                __$coverCall('webdocs/test/src/lib/core-event.js', '792:850');
                console.debug('Akonda Core - Emit event', eventName, data);
            }
            __$coverCall('webdocs/test/src/lib/core-event.js', '858:896');
            return ee.emitEvent(eventName, [data]);
        };
        __$coverCall('webdocs/test/src/lib/core-event.js', '904:1098');
        event.prototype.on = function (eventName, listener) {
            __$coverCall('webdocs/test/src/lib/core-event.js', '959:1048');
            if (this.debug) {
                __$coverCall('webdocs/test/src/lib/core-event.js', '980:1044');
                console.debug('Akonda Core - Add listener', eventName, listener);
            }
            __$coverCall('webdocs/test/src/lib/core-event.js', '1052:1094');
            return ee.addListener(eventName, listener);
        };
        __$coverCall('webdocs/test/src/lib/core-event.js', '1102:1441');
        event.prototype.once = function (eventName, listener) {
            __$coverCall('webdocs/test/src/lib/core-event.js', '1159:1288');
            var onceListener = function () {
                __$coverCall('webdocs/test/src/lib/core-event.js', '1194:1232');
                ee.removeListener(eventName, listener);
                __$coverCall('webdocs/test/src/lib/core-event.js', '1237:1267');
                listener.call(null, arguments);
                __$coverCall('webdocs/test/src/lib/core-event.js', '1272:1283');
                return true;
            };
            __$coverCall('webdocs/test/src/lib/core-event.js', '1293:1387');
            if (this.debug) {
                __$coverCall('webdocs/test/src/lib/core-event.js', '1314:1383');
                console.debug('Akonda Core - Add once listener', eventName, listener);
            }
            __$coverCall('webdocs/test/src/lib/core-event.js', '1391:1437');
            return ee.addListener(eventName, onceListener);
        };
        __$coverCall('webdocs/test/src/lib/core-event.js', '1445:1734');
        event.prototype.off = function (eventName, listener) {
            __$coverCall('webdocs/test/src/lib/core-event.js', '1501:1593');
            if (this.debug) {
                __$coverCall('webdocs/test/src/lib/core-event.js', '1522:1589');
                console.debug('Akonda Core - Remove listener', eventName, listener);
            }
            __$coverCall('webdocs/test/src/lib/core-event.js', '1598:1730');
            if (listener === undefined) {
                __$coverCall('webdocs/test/src/lib/core-event.js', '1631:1663');
                return ee.removeEvent(eventName);
            } else {
                __$coverCall('webdocs/test/src/lib/core-event.js', '1681:1726');
                return ee.removeListener(eventName, listener);
            }
        };
        __$coverCall('webdocs/test/src/lib/core-event.js', '1738:1750');
        return event;
    }();