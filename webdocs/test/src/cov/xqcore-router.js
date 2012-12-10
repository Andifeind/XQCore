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
__$coverInit("webdocs/test/src/lib/xqcore-router.js", "/**\n * XQCore Router API\n *\n * @author Andi Heinkelein - noname-media.com\n * @copyright Andi Heinkelein - noname-media.com\n * @package XQCore\n *\n * Based on router.js\n * Copyright Aaron Blohowiak and TJ Holowaychuk 2011.\n * https://github.com/aaronblohowiak/routes.js\n */\n XQCore.Router = (function(undefined) {\n\n\t/**\n\t * Convert path to route object\n\t *\n\t * A string or RegExp should be passed,\n\t * will return { re, src, keys} obj\n\t *\n\t * @param  {String / RegExp} path\n\t * @return {Object}\n\t */\n\tvar Route = function(path){\n\t\t//using 'new' is optional\n\t\t\n\t\tvar src, re, keys = [];\n\t\t\n\t\tif(path instanceof RegExp){\n\t\t\tre = path;\n\t\t\tsrc = path.toString();\n\t\t}else{\n\t\t\tre = pathToRegExp(path, keys);\n\t\t\tsrc = path;\n\t\t}\n\n\t\treturn {\n\t\t\tre: re,\n\t\t\tsrc: path.toString(),\n\t\t\tkeys: keys\n\t\t};\n\t};\n\n\t/**\n\t * Normalize the given path string,\n\t * returning a regular expression.\n\t *\n\t * An empty array should be passed,\n\t * which will contain the placeholder\n\t * key names. For example \"/user/:id\" will\n\t * then contain [\"id\"].\n\t *\n\t * @param  {String} path\n\t * @param  {Array} keys\n\t * @return {RegExp}\n\t */\n\tvar pathToRegExp = function (path, keys) {\n\t\tpath = path\n\t\t\t.concat('/?')\n\t\t\t.replace(/\\/\\(/g, '(?:/')\n\t\t\t.replace(/(\\/)?(\\.)?:(\\w+)(?:(\\(.*?\\)))?(\\?)?/g, function(_, slash, format, key, capture, optional){\n\t\t\t\tkeys.push(key);\n\t\t\t\tslash = slash || '';\n\t\t\t\treturn ''\n\t\t\t\t\t+ (optional ? '' : slash)\n\t\t\t\t\t+ '(?:'\n\t\t\t\t\t+ (optional ? slash : '')\n\t\t\t\t\t+ (format || '') + (capture || '([^/]+?)') + ')'\n\t\t\t\t\t+ (optional || '');\n\t\t\t})\n\t\t\t.replace(/([\\/.])/g, '\\\\$1')\n\t\t\t.replace(/\\*/g, '(.+)');\n\t\treturn new RegExp('^' + path + '$', 'i');\n\t};\n\n\t/**\n\t * Attempt to match the given request to\n\t * one of the routes. When successful\n\t * a  {fn, params, splats} obj is returned\n\t *\n\t * @param  {Array} routes\n\t * @param  {String} uri\n\t * @return {Object}\n\t */\n\tvar match = function (routes, uri) {\n\t\tvar captures, i = 0;\n\n\t\tfor (var len = routes.length; i < len; ++i) {\n\t\t\tvar route = routes[i],\n\t\t\t    re = route.re,\n\t\t\t    keys = route.keys,\n\t\t\t    splats = [],\n\t\t\t    params = {},\n\t\t\t    j;\n\n\t\t\tcaptures = re.exec(uri);\n\t\t\tif (captures) {\n\t\t\t\tfor (j = 1, len = captures.length; j < len; ++j) {\n\t\t\t\t\tvar key = keys[j-1],\n\t\t\t\t\t\tval = typeof captures[j] === 'string'\n\t\t\t\t\t\t\t? decodeURIComponent(captures[j])\n\t\t\t\t\t\t\t: captures[j];\n\t\t\t\t\tif (key) {\n\t\t\t\t\t\tparams[key] = val;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tsplats.push(val);\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\treturn {\n\t\t\t\t\tparams: params,\n\t\t\t\t\tsplats: splats,\n\t\t\t\t\troute: route.src\n\t\t\t\t};\n\t\t\t}\n\t\t}\n\t};\n\n\t/**\n\t * Default \"normal\" router constructor.\n\t * accepts path, fn tuples via addRoute\n\t * returns {fn, params, splats, route}\n\t *  via match\n\t *\n\t * @return {Object}\n\t */\n\t// var getRouter = function() {\n\t//   //using 'new' is optional\n\t//   return {\n\t//     routes: [],\n\t//     routeMap : {},\n\t//     addRoute: function(path, fn) {\n\t//       if (!path) {\n\t//         throw new Error(' route requires a path');\n\t//       }\n\n\t//       if (!fn) {\n\t//        throw new Error(' route ' + path.toString() + ' requires a callback');\n\t//       }\n\n\t//       var route = new Route(path);\n\t//       route.fn = fn;\n\n\t//       this.routes.push(route);\n\t//       this.routeMap[path] = fn;\n\t//     },\n\n\t//     match: function(pathname) {\n\t//       var route = match(this.routes, pathname);\n\t//       if(route){\n\t//         route.fn = this.routeMap[route.route];\n\t//       }\n\t//       return route;\n\t//     }\n\t//   };\n\t// };\n\n\tvar router = function(conf) {\n\t\tconf = $.extend({\n\t\t\tdebug: false\n\t\t}, conf);\n\n\t\tthis.debug = Boolean(conf.debug);\n\n\t\tthis.routes = [];\n\t    this.routeMap = {};\n\t};\n\n\trouter.prototype.addRoute = function(path, fn) {\n\t\tif (!path) {\n\t\t\tthrow new Error(' route requires a path');\n\t\t}\n\n\t\tif (!fn) {\n\t\t\tthrow new Error(' route ' + path.toString() + ' requires a callback');\n\t\t}\n\n\t\tvar route = new Route(path);\n\t\troute.fn = fn;\n\n\t\tthis.routes.push(route);\n\t\tthis.routeMap[path] = fn;\n\t};\n\n\trouter.prototype.match = function(pathname) {\n\t\tvar route = match(this.routes, pathname);\n\t\tif(route){\n\t\t\troute.fn = this.routeMap[route.route];\n\t\t}\n\t\treturn route;\n\t};\n\n\treturn router;\n\n})();");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "273:4096");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "499:788");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1100:1632");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1848:2505");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3421:3584");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3588:3901");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3905:4072");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "4076:4089");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "560:582");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "589:717");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "722:784");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "620:629");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "634:655");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "669:698");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "703:713");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1145:1584");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1588:1628");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1311:1325");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1331:1350");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1356:1518");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1887:1906");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1911:2501");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "1960:2079");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2085:2108");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2113:2497");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2133:2407");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2414:2492");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2189:2315");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2322:2401");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2339:2356");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "2378:2394");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3453:3497");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3502:3534");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3539:3555");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3562:3580");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3639:3700");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3705:3792");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3797:3824");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3828:3841");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3846:3869");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3873:3897");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3655:3696");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3719:3788");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3953:3993");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "3997:4052");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "4056:4068");
__$coverInitRange("webdocs/test/src/lib/xqcore-router.js", "4011:4048");
__$coverCall('webdocs/test/src/lib/xqcore-router.js', '273:4096');
XQCore.Router = function (undefined) {
    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '499:788');
    var Route = function (path) {
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '560:582');
        var src, re, keys = [];
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '589:717');
        if (path instanceof RegExp) {
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '620:629');
            re = path;
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '634:655');
            src = path.toString();
        } else {
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '669:698');
            re = pathToRegExp(path, keys);
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '703:713');
            src = path;
        }
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '722:784');
        return {
            re: re,
            src: path.toString(),
            keys: keys
        };
    };
    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1100:1632');
    var pathToRegExp = function (path, keys) {
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1145:1584');
        path = path.concat('/?').replace(/\/\(/g, '(?:/').replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function (_, slash, format, key, capture, optional) {
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1311:1325');
            keys.push(key);
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1331:1350');
            slash = slash || '';
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1356:1518');
            return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || '([^/]+?)') + ')' + (optional || '');
        }).replace(/([\/.])/g, '\\$1').replace(/\*/g, '(.+)');
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1588:1628');
        return new RegExp('^' + path + '$', 'i');
    };
    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1848:2505');
    var match = function (routes, uri) {
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1887:1906');
        var captures, i = 0;
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1911:2501');
        for (var len = routes.length; i < len; ++i) {
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '1960:2079');
            var route = routes[i], re = route.re, keys = route.keys, splats = [], params = {}, j;
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2085:2108');
            captures = re.exec(uri);
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2113:2497');
            if (captures) {
                __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2133:2407');
                for (j = 1, len = captures.length; j < len; ++j) {
                    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2189:2315');
                    var key = keys[j - 1], val = typeof captures[j] === 'string' ? decodeURIComponent(captures[j]) : captures[j];
                    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2322:2401');
                    if (key) {
                        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2339:2356');
                        params[key] = val;
                    } else {
                        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2378:2394');
                        splats.push(val);
                    }
                }
                __$coverCall('webdocs/test/src/lib/xqcore-router.js', '2414:2492');
                return {
                    params: params,
                    splats: splats,
                    route: route.src
                };
            }
        }
    };
    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3421:3584');
    var router = function (conf) {
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3453:3497');
        conf = $.extend({ debug: false }, conf);
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3502:3534');
        this.debug = Boolean(conf.debug);
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3539:3555');
        this.routes = [];
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3562:3580');
        this.routeMap = {};
    };
    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3588:3901');
    router.prototype.addRoute = function (path, fn) {
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3639:3700');
        if (!path) {
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3655:3696');
            throw new Error(' route requires a path');
        }
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3705:3792');
        if (!fn) {
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3719:3788');
            throw new Error(' route ' + path.toString() + ' requires a callback');
        }
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3797:3824');
        var route = new Route(path);
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3828:3841');
        route.fn = fn;
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3846:3869');
        this.routes.push(route);
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3873:3897');
        this.routeMap[path] = fn;
    };
    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3905:4072');
    router.prototype.match = function (pathname) {
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3953:3993');
        var route = match(this.routes, pathname);
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '3997:4052');
        if (route) {
            __$coverCall('webdocs/test/src/lib/xqcore-router.js', '4011:4048');
            route.fn = this.routeMap[route.route];
        }
        __$coverCall('webdocs/test/src/lib/xqcore-router.js', '4056:4068');
        return route;
    };
    __$coverCall('webdocs/test/src/lib/xqcore-router.js', '4076:4089');
    return router;
}();