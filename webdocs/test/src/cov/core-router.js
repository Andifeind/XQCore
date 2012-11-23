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
__$coverInit("webdocs/test/src/lib/core-router.js", "var CoreRouter = function(conf) {\n\tvar CoreRouter,\n\t\trouter ;\n\n\tCoreRouter = Backbone.Router.extend(conf);\n\trouter = new CoreRouter();\n\tBackbone.history.start();\n\treturn router;\n};");
__$coverInitRange("webdocs/test/src/lib/core-router.js", "0:179");
__$coverInitRange("webdocs/test/src/lib/core-router.js", "35:60");
__$coverInitRange("webdocs/test/src/lib/core-router.js", "64:105");
__$coverInitRange("webdocs/test/src/lib/core-router.js", "108:133");
__$coverInitRange("webdocs/test/src/lib/core-router.js", "136:160");
__$coverInitRange("webdocs/test/src/lib/core-router.js", "163:176");
__$coverCall('webdocs/test/src/lib/core-router.js', '0:179');
var CoreRouter = function (conf) {
    __$coverCall('webdocs/test/src/lib/core-router.js', '35:60');
    var CoreRouter, router;
    __$coverCall('webdocs/test/src/lib/core-router.js', '64:105');
    CoreRouter = Backbone.Router.extend(conf);
    __$coverCall('webdocs/test/src/lib/core-router.js', '108:133');
    router = new CoreRouter();
    __$coverCall('webdocs/test/src/lib/core-router.js', '136:160');
    Backbone.history.start();
    __$coverCall('webdocs/test/src/lib/core-router.js', '163:176');
    return router;
};