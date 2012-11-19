if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
__$coverObject["webdocs/test/src/lib/core-logger.js"] = {};
__$coverObject["webdocs/test/src/lib/core-logger.js"].__code = "var CoreLogger = (function(conf) {\n\n\tvar logger = function() {\n\t\t\n\t};\n\n\tlogger.prototype.log = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.log.apply(console, args);\n\t\t}\n\t};\n\n\tlogger.prototype.warn = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.warn.apply(console, args);\n\t\t}\n\t};\n\n\tlogger.prototype.error = function() {\n\t\tvar args;\n\n\t\tif (this.debug) {\n\t\t\targs = Array.prototype.slice.call(arguments);\n\t\t\targs.unshift('[' + this.name + ']');\n\t\t\tconsole.error.apply(console, args);\n\t\t}\n\t};\n\n\treturn logger;\n})();";
__$coverObject["webdocs/test/src/lib/core-logger.js"]["0:712"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["37:68"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["72:273"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["277:480"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["484:689"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["693:706"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["110:118"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["123:269"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["144:188"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["193:228"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["233:265"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["316:324"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["329:476"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["350:394"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["399:434"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["439:472"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["524:532"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["537:685"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["558:602"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["607:642"] = 0;
__$coverObject["webdocs/test/src/lib/core-logger.js"]["647:681"] = 0;
__$coverObject['webdocs/test/src/lib/core-logger.js']['0:712']++;
var CoreLogger = function (conf) {
        __$coverObject['webdocs/test/src/lib/core-logger.js']['37:68']++;
        var logger = function () {
        };
        __$coverObject['webdocs/test/src/lib/core-logger.js']['72:273']++;
        logger.prototype.log = function () {
            __$coverObject['webdocs/test/src/lib/core-logger.js']['110:118']++;
            var args;
            __$coverObject['webdocs/test/src/lib/core-logger.js']['123:269']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/core-logger.js']['144:188']++;
                args = Array.prototype.slice.call(arguments);
                __$coverObject['webdocs/test/src/lib/core-logger.js']['193:228']++;
                args.unshift('[' + this.name + ']');
                __$coverObject['webdocs/test/src/lib/core-logger.js']['233:265']++;
                console.log.apply(console, args);
            }
        };
        __$coverObject['webdocs/test/src/lib/core-logger.js']['277:480']++;
        logger.prototype.warn = function () {
            __$coverObject['webdocs/test/src/lib/core-logger.js']['316:324']++;
            var args;
            __$coverObject['webdocs/test/src/lib/core-logger.js']['329:476']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/core-logger.js']['350:394']++;
                args = Array.prototype.slice.call(arguments);
                __$coverObject['webdocs/test/src/lib/core-logger.js']['399:434']++;
                args.unshift('[' + this.name + ']');
                __$coverObject['webdocs/test/src/lib/core-logger.js']['439:472']++;
                console.warn.apply(console, args);
            }
        };
        __$coverObject['webdocs/test/src/lib/core-logger.js']['484:689']++;
        logger.prototype.error = function () {
            __$coverObject['webdocs/test/src/lib/core-logger.js']['524:532']++;
            var args;
            __$coverObject['webdocs/test/src/lib/core-logger.js']['537:685']++;
            if (this.debug) {
                __$coverObject['webdocs/test/src/lib/core-logger.js']['558:602']++;
                args = Array.prototype.slice.call(arguments);
                __$coverObject['webdocs/test/src/lib/core-logger.js']['607:642']++;
                args.unshift('[' + this.name + ']');
                __$coverObject['webdocs/test/src/lib/core-logger.js']['647:681']++;
                console.error.apply(console, args);
            }
        };
        __$coverObject['webdocs/test/src/lib/core-logger.js']['693:706']++;
        return logger;
    }();