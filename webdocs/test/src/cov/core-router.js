if (typeof __$coverObject === "undefined"){
	if (typeof window !== "undefined") window.__$coverObject = {};
	else if (typeof global !== "undefined") global.__$coverObject = {};
	else throw new Error("cannot find the global scope");
}
__$coverObject["webdocs/test/src/lib/core-router.js"] = {};
__$coverObject["webdocs/test/src/lib/core-router.js"].__code = "var CoreRouter = function(conf) {\n\tvar CoreRouter,\n\t\trouter ;\n\n\tCoreRouter = Backbone.Router.extend(conf);\n\trouter = new CoreRouter();\n\tBackbone.history.start();\n\treturn router;\n};";
__$coverObject["webdocs/test/src/lib/core-router.js"]["0:179"] = 0;
__$coverObject["webdocs/test/src/lib/core-router.js"]["35:60"] = 0;
__$coverObject["webdocs/test/src/lib/core-router.js"]["64:105"] = 0;
__$coverObject["webdocs/test/src/lib/core-router.js"]["108:133"] = 0;
__$coverObject["webdocs/test/src/lib/core-router.js"]["136:160"] = 0;
__$coverObject["webdocs/test/src/lib/core-router.js"]["163:176"] = 0;
__$coverObject['webdocs/test/src/lib/core-router.js']['0:179']++;
var CoreRouter = function (conf) {
    __$coverObject['webdocs/test/src/lib/core-router.js']['35:60']++;
    var CoreRouter, router;
    __$coverObject['webdocs/test/src/lib/core-router.js']['64:105']++;
    CoreRouter = Backbone.Router.extend(conf);
    __$coverObject['webdocs/test/src/lib/core-router.js']['108:133']++;
    router = new CoreRouter();
    __$coverObject['webdocs/test/src/lib/core-router.js']['136:160']++;
    Backbone.history.start();
    __$coverObject['webdocs/test/src/lib/core-router.js']['163:176']++;
    return router;
};