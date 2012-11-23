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
__$coverInit("webdocs/test/src/lib/core-logger.js", "var CoreLogger = (function(conf) {\n\n\t//var timerStore = {};\n\n\tfunction getHumanTime(time) {\n\t\tif (time < 1000) {\n\t\t\treturn time + ' ms';\n\t\t}\n\t\telse if (time < 60000) {\n\t\t\treturn (Math.round(time / 100) / 10) + ' sec';\n\t\t}\n\t\telse {\n\t\t\treturn (Math.round(time / 60000)) + ' min ' + Math.round(time % 60000 / 1000) + ' sec';\n\t\t}\n\t}\n\n\tvar logger = function() {\n\t\t\n\t};\n\n\tlogger.prototype.log = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.log.apply(console, args);\n\t\t}\n\t};\n\n\tlogger.prototype.warn = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.warn.apply(console, args);\n\t\t}\n\t};\n\n\tlogger.prototype.error = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.error.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Start a timeTracer\n\t *\n\t * @param {String} timerName Set the name for your (Optional)\n\t * @return {Object} Returns a TimerObject\n\t */\n\tlogger.prototype.timer = function(name) {\n\t\tvar timer = {\n\t\t\tstart: null,\n\t\t\tstop: null,\n\t\t\tname: name,\n\t\t\tlogger: this,\n\t\t\tend: function() {\n\t\t\t\tthis.stop = Date.now();\n\t\t\t\tthis.logger.log('Timer ' + this.name + ' runs: ', getHumanTime(this.stop - this.start));\n\t\t\t}\n\t\t};\n\n\t\t/*if (name) {\n\t\t\tthis.timerStore[name] = timer;\n\t\t}*/\n\n\t\tthis.log('Start Timer', name);\n\n\t\t//Set timer start time\n\t\ttimer.start = Date.now();\n\t\treturn timer;\n\t};\n\n\t/**\n\t * Stops a timer\n\t *\n\t * @param {String or Object} timerName Stops the given timer\n\t */\n\tlogger.prototype.timerEnd = function(timer) {\n\t\t//Set stop timer\n\t\t\n\t};\n\n\tlogger.prototype.__scope = {\n\t\tgetHumanTime: getHumanTime\n\t};\n\t\n\n\treturn logger;\n})();");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "0:1823");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "62:327");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "331:362");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "366:567");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "571:774");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "778:983");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "1130:1566");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "1664:1734");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "1738:1798");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "1804:1817");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "94:324");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "116:135");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "171:216");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "234:320");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "404:412");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "417:563");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "438:482");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "487:522");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "527:559");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "610:618");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "623:770");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "644:688");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "693:728");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "733:766");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "818:826");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "831:979");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "852:896");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "901:936");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "941:975");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "1174:1401");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "1463:1492");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "1522:1546");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "1550:1562");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "1276:1298");
__$coverInitRange("webdocs/test/src/lib/core-logger.js", "1304:1391");
__$coverCall('webdocs/test/src/lib/core-logger.js', '0:1823');
var CoreLogger = function (conf) {
        __$coverCall('webdocs/test/src/lib/core-logger.js', '62:327');
        function getHumanTime(time) {
            __$coverCall('webdocs/test/src/lib/core-logger.js', '94:324');
            if (time < 1000) {
                __$coverCall('webdocs/test/src/lib/core-logger.js', '116:135');
                return time + ' ms';
            } else if (time < 60000) {
                __$coverCall('webdocs/test/src/lib/core-logger.js', '171:216');
                return Math.round(time / 100) / 10 + ' sec';
            } else {
                __$coverCall('webdocs/test/src/lib/core-logger.js', '234:320');
                return Math.round(time / 60000) + ' min ' + Math.round(time % 60000 / 1000) + ' sec';
            }
        }
        __$coverCall('webdocs/test/src/lib/core-logger.js', '331:362');
        var logger = function () {
        };
        __$coverCall('webdocs/test/src/lib/core-logger.js', '366:567');
        logger.prototype.log = function () {
            __$coverCall('webdocs/test/src/lib/core-logger.js', '404:412');
            var args;
            __$coverCall('webdocs/test/src/lib/core-logger.js', '417:563');
            if (this.debug) {
                __$coverCall('webdocs/test/src/lib/core-logger.js', '438:482');
                args = Array.prototype.slice.call(arguments);
                __$coverCall('webdocs/test/src/lib/core-logger.js', '487:522');
                args.unshift('[' + this.name + ']');
                __$coverCall('webdocs/test/src/lib/core-logger.js', '527:559');
                console.log.apply(console, args);
            }
        };
        __$coverCall('webdocs/test/src/lib/core-logger.js', '571:774');
        logger.prototype.warn = function () {
            __$coverCall('webdocs/test/src/lib/core-logger.js', '610:618');
            var args;
            __$coverCall('webdocs/test/src/lib/core-logger.js', '623:770');
            if (this.debug) {
                __$coverCall('webdocs/test/src/lib/core-logger.js', '644:688');
                args = Array.prototype.slice.call(arguments);
                __$coverCall('webdocs/test/src/lib/core-logger.js', '693:728');
                args.unshift('[' + this.name + ']');
                __$coverCall('webdocs/test/src/lib/core-logger.js', '733:766');
                console.warn.apply(console, args);
            }
        };
        __$coverCall('webdocs/test/src/lib/core-logger.js', '778:983');
        logger.prototype.error = function () {
            __$coverCall('webdocs/test/src/lib/core-logger.js', '818:826');
            var args;
            __$coverCall('webdocs/test/src/lib/core-logger.js', '831:979');
            if (this.debug) {
                __$coverCall('webdocs/test/src/lib/core-logger.js', '852:896');
                args = Array.prototype.slice.call(arguments);
                __$coverCall('webdocs/test/src/lib/core-logger.js', '901:936');
                args.unshift('[' + this.name + ']');
                __$coverCall('webdocs/test/src/lib/core-logger.js', '941:975');
                console.error.apply(console, args);
            }
        };
        __$coverCall('webdocs/test/src/lib/core-logger.js', '1130:1566');
        logger.prototype.timer = function (name) {
            __$coverCall('webdocs/test/src/lib/core-logger.js', '1174:1401');
            var timer = {
                    start: null,
                    stop: null,
                    name: name,
                    logger: this,
                    end: function () {
                        __$coverCall('webdocs/test/src/lib/core-logger.js', '1276:1298');
                        this.stop = Date.now();
                        __$coverCall('webdocs/test/src/lib/core-logger.js', '1304:1391');
                        this.logger.log('Timer ' + this.name + ' runs: ', getHumanTime(this.stop - this.start));
                    }
                };
            __$coverCall('webdocs/test/src/lib/core-logger.js', '1463:1492');
            this.log('Start Timer', name);
            __$coverCall('webdocs/test/src/lib/core-logger.js', '1522:1546');
            timer.start = Date.now();
            __$coverCall('webdocs/test/src/lib/core-logger.js', '1550:1562');
            return timer;
        };
        __$coverCall('webdocs/test/src/lib/core-logger.js', '1664:1734');
        logger.prototype.timerEnd = function (timer) {
        };
        __$coverCall('webdocs/test/src/lib/core-logger.js', '1738:1798');
        logger.prototype.__scope = { getHumanTime: getHumanTime };
        __$coverCall('webdocs/test/src/lib/core-logger.js', '1804:1817');
        return logger;
    }();