if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"] = {};
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"].__code = "XQCore.Logger = (function(conf) {\n\n\t//var timerStore = {};\n\n\tfunction getHumanTime(time) {\n\t\tif (time < 1000) {\n\t\t\treturn time + ' ms';\n\t\t}\n\t\telse if (time < 60000) {\n\t\t\treturn (Math.round(time / 100) / 10) + ' sec';\n\t\t}\n\t\telse {\n\t\t\treturn (Math.round(time / 60000)) + ' min ' + Math.round(time % 60000 / 1000) + ' sec';\n\t\t}\n\t}\n\n\tfunction onScreenConsole() {\n\t\tvar conf,\n\t\t\thtml;\n\n\t\tconf = localStorage.get('xqcore-onscreen-console') || {\n\t\t\tpos: 'bottom'\n\t\t};\n\n\t\thtml = '<div id=\"XQCoreLogger-OnScreenConsole\">\\\n\t\t\t</div>';\n\t}\n\n\t/**\n\t * XQCore Logger is a logging tool to log messages, warnings, errors to the browser or onscreen console\n\t *\n\t * @return {[type]} [description]\n\t */\n\tvar logger = function() {\n\t\t\n\t};\n\n\t/**\n\t * Loggs a message to the console\n\t *\n\t * @param {Any} msg logs all arguments to the console\n\t */\n\tlogger.prototype.log = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.log.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Loggs a warning to the console\n\t *\n\t * @param {Any} msg logs all arguments to the console\n\t */\n\tlogger.prototype.warn = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.warn.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Loggs a error message to the console\n\t *\n\t * @param {Any} msg logs all arguments to the console\n\t */\n\tlogger.prototype.error = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.error.apply(console, args);\n\t\t}\n\t};\n\n\t/**\n\t * Start a timeTracer\n\t *\n\t * @param {String} timerName Set the name for your (Optional)\n\t * @return {Object} Returns a TimerObject\n\t */\n\tlogger.prototype.timer = function(name) {\n\t\tvar timer = {\n\t\t\tstart: null,\n\t\t\tstop: null,\n\t\t\tname: name,\n\t\t\tlogger: this,\n\t\t\tend: function() {\n\t\t\t\tthis.stop = Date.now();\n\t\t\t\tthis.logger.log('Timer ' + this.name + ' runs: ', getHumanTime(this.stop - this.start));\n\t\t\t}\n\t\t};\n\n\t\t/*if (name) {\n\t\t\tthis.timerStore[name] = timer;\n\t\t}*/\n\n\t\tthis.log('Start Timer', name);\n\n\t\t//Set timer start time\n\t\ttimer.start = Date.now();\n\t\treturn timer;\n\t};\n\n\t/**\n\t * Stops a timer\n\t *\n\t * @param {String or Object} timerName Stops the given timer\n\t */\n\tlogger.prototype.timerEnd = function(timer) {\n\t\t//Set stop timer\n\t\t\n\t};\n\n\tlogger.prototype.__scope = {\n\t\tgetHumanTime: getHumanTime\n\t};\n\t\n\n\treturn logger;\n})();";
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["0:2494"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["61:326"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["330:526"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["684:715"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["823:1024"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["1132:1335"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["1449:1654"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["1801:2237"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["2335:2405"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["2409:2469"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["2475:2488"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["93:323"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["115:134"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["170:215"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["233:319"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["361:378"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["383:459"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["464:523"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["861:869"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["874:1020"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["895:939"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["944:979"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["984:1016"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["1171:1179"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["1184:1331"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["1205:1249"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["1254:1289"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["1294:1327"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["1489:1497"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["1502:1650"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["1523:1567"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["1572:1607"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["1612:1646"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["1845:2072"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["2134:2163"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["2193:2217"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["2221:2233"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["1947:1969"] = 0;
__$coverObject["webdocs/test/src/lib/xqcore-logger.js"]["1975:2062"] = 0;
__$coverObject['webdocs/test/src/lib/xqcore-logger.js']['0:2494']++;
XQCore.Logger = function (conf) {
    __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['61:326']++;
    function getHumanTime(time) {
        __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['93:323']++;
        if (time < 1000) {
            __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['115:134']++;
            return time + ' ms';
        } else if (time < 60000) {
            __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['170:215']++;
            return Math.round(time / 100) / 10 + ' sec';
        } else {
            __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['233:319']++;
            return Math.round(time / 60000) + ' min ' + Math.round(time % 60000 / 1000) + ' sec';
        }
    }
    __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['330:526']++;
    function onScreenConsole() {
        __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['361:378']++;
        var conf, html;
        __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['383:459']++;
        conf = localStorage.get('xqcore-onscreen-console') || {pos: 'bottom'};
        __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['464:523']++;
        html = '<div id="XQCoreLogger-OnScreenConsole">\t\t\t</div>';
    }
    __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['684:715']++;
    var logger = function () {
    };
    __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['823:1024']++;
    logger.prototype.log = function () {
        __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['861:869']++;
        var args;
        __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['874:1020']++;
        if (this.debug) {
            __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['895:939']++;
            args = Array.prototype.slice.call(arguments);
            __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['944:979']++;
            args.unshift('[' + this.name + ']');
            __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['984:1016']++;
            console.log.apply(console, args);
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['1132:1335']++;
    logger.prototype.warn = function () {
        __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['1171:1179']++;
        var args;
        __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['1184:1331']++;
        if (this.debug) {
            __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['1205:1249']++;
            args = Array.prototype.slice.call(arguments);
            __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['1254:1289']++;
            args.unshift('[' + this.name + ']');
            __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['1294:1327']++;
            console.warn.apply(console, args);
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['1449:1654']++;
    logger.prototype.error = function () {
        __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['1489:1497']++;
        var args;
        __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['1502:1650']++;
        if (this.debug) {
            __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['1523:1567']++;
            args = Array.prototype.slice.call(arguments);
            __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['1572:1607']++;
            args.unshift('[' + this.name + ']');
            __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['1612:1646']++;
            console.error.apply(console, args);
        }
    };
    __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['1801:2237']++;
    logger.prototype.timer = function (name) {
        __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['1845:2072']++;
        var timer = {
                start: null,
                stop: null,
                name: name,
                logger: this,
                end: function () {
                    __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['1947:1969']++;
                    this.stop = Date.now();
                    __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['1975:2062']++;
                    this.logger.log('Timer ' + this.name + ' runs: ', getHumanTime(this.stop - this.start));
                }
            };
        __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['2134:2163']++;
        this.log('Start Timer', name);
        __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['2193:2217']++;
        timer.start = Date.now();
        __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['2221:2233']++;
        return timer;
    };
    __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['2335:2405']++;
    logger.prototype.timerEnd = function (timer) {
    };
    __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['2409:2469']++;
    logger.prototype.__scope = {getHumanTime: getHumanTime};
    __$coverObject['webdocs/test/src/lib/xqcore-logger.js']['2475:2488']++;
    return logger;
}();